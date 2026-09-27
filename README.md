\# AIVOA Deviation Intake



AI-powered deviation intake module for pharmaceutical manufacturing.



\## Overview



This project provides an AI-assisted workflow for capturing and reviewing manufacturing deviations.



The system can:



\- Extract structured deviation information from text

\- Extract deviation information from PDF documents

\- Generate a preliminary impact and severity assessment

\- Allow users to edit extracted information using natural language

\- Allow human review before saving

\- Store reviewed deviations in MySQL



\## Tech Stack



\### Frontend

\- React

\- Redux Toolkit

\- Axios



\### Backend

\- Python

\- FastAPI

\- LangGraph

\- Groq

\- Pydantic

\- PyMuPDF

\- MySQL



\## Workflow



User Input / PDF

&#x20;       ↓

React + Redux

&#x20;       ↓

FastAPI

&#x20;       ↓

LangGraph

&#x20;       ↓

Groq LLM

&#x20;       ↓

Structured Deviation Data

&#x20;       ↓

Human Review \& Editing

&#x20;       ↓

MySQL



\## Key Features



\### AI Extraction

The system extracts fields such as:



\- Batch number

\- Date of occurrence

\- Description

\- Parameter

\- Actual value

\- Expected range

\- Duration

\- Immediate action



\### AI Assessment



The system provides a preliminary impact and severity assessment with a short explanation.



The assessment is intended to support human Quality review and is not a final Quality decision.



\### PDF Processing



PDF text is extracted using PyMuPDF and passed through the same AI workflow.



\### Human-in-the-Loop Editing



Users can provide natural-language instructions to modify extracted deviation information before saving.



\## Running Locally



\### Backend



```bash

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload

\### Frontend

cd frontend
npm install
npm run dev
