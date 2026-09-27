import os
import json

from typing import TypedDict, Optional

from langgraph.graph import StateGraph, START, END

from dotenv import load_dotenv
from groq import Groq

from .prompts import (
    EXTRACTION_PROMPT,
    ASSESSMENT_PROMPT,
    EDIT_PROMPT,
)
from .schemas import DeviationData, ImpactAssessment

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

class DeviationState(TypedDict):
    input_text: str
    deviation: Optional[DeviationData]
    assessment: Optional[ImpactAssessment]

def extract_deviation(text: str) -> DeviationData:

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": EXTRACTION_PROMPT
            },
            {
                "role": "user",
                "content": text
            }
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    result = response.choices[0].message.content

    data = json.loads(result)

    validated_data = DeviationData.model_validate(data)

    return validated_data

def assess_impact(deviation: DeviationData) -> ImpactAssessment:

    deviation_json = deviation.model_dump_json()

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": ASSESSMENT_PROMPT
            },
            {
                "role": "user",
                "content": deviation_json
            }
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    result = response.choices[0].message.content

    data = json.loads(result)

    validated_assessment = ImpactAssessment.model_validate(data)

    return validated_assessment

def edit_deviation(
    deviation: DeviationData,
    instruction: str
) -> DeviationData:

    current_data = deviation.model_dump_json()

    user_message = f"""
Current deviation data:

{current_data}

User instruction:

{instruction}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": EDIT_PROMPT
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    result = response.choices[0].message.content

    data = json.loads(result)

    validated_data = DeviationData.model_validate(data)

    return validated_data

def extract_node(state: DeviationState):

    deviation = extract_deviation(
        state["input_text"]
    )

    return {
        "deviation": deviation
    }

def assessment_node(state: DeviationState):

    assessment = assess_impact(state["deviation"])

    return {
        "assessment": assessment
    }

builder = StateGraph(DeviationState)

builder.add_node("extract", extract_node)
builder.add_node("assessment", assessment_node)

builder.add_edge(START, "extract")
builder.add_edge("extract", "assessment")
builder.add_edge("assessment", END)

graph = builder.compile()