from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

from app.ai.graph import graph, edit_deviation
from app.ai.schemas import (
    SaveDeviationRequest,
    DeviationData,
)
from app.database import get_connection

from fastapi.middleware.cors import CORSMiddleware

import pymupdf

app = FastAPI(title="AIVOA Deviation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

class EditDeviationRequest(BaseModel):
    deviation: dict
    instruction: str    


@app.get("/")
def home():
    return {"message": "AIVOA Deviation API is running"}

@app.post("/api/deviations/analyze")
def analyze_deviation(request: AnalyzeRequest):

    result = graph.invoke({
        "input_text": request.text,
        "deviation": None,
        "assessment": None
    })

    return {
        "deviation": result["deviation"],
        "assessment": result["assessment"]
    }

@app.post("/api/deviations/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):

    contents = await file.read()

    pdf = pymupdf.open(stream=contents, filetype="pdf")
    text = ""

    for page in pdf:
        text += page.get_text()

    pdf.close()

    result = graph.invoke({
        "input_text": text,
        "deviation": None,
        "assessment": None
    })

    return {
        "filename": file.filename,
        "extracted_text": text,
        "deviation": result["deviation"],
        "assessment": result["assessment"]
    }

@app.post("/api/deviations/edit")
def edit_deviation_endpoint(request: EditDeviationRequest):

    current_deviation = DeviationData.model_validate(
        request.deviation
    )

    updated_deviation = edit_deviation(
        current_deviation,
        request.instruction
    )

    return {
        "deviation": updated_deviation
    }

@app.post("/api/deviations")
def save_deviation(request: SaveDeviationRequest):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO deviations (
            site_plant,
            date_of_occurrence,
            title,
            source,
            related_product,
            batch_number,
            detailed_description,
            parameter,
            actual_value,
            expected_range,
            duration,
            immediate_action,
            detected_by,
            impact,
            severity,
            assessment_reason
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        request.site_plant,
        request.date_of_occurrence,
        request.title,
        request.source,
        request.related_product,
        request.batch_number,
        request.detailed_description,
        request.parameter,
        request.actual_value,
        request.expected_range,
        request.duration,
        request.immediate_action,
        request.detected_by,
        request.impact,
        request.severity,
        request.assessment_reason
    )

    cursor.execute(query, values)

    connection.commit()

    deviation_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "message": "Deviation saved successfully",
        "id": deviation_id
    }