from typing import Optional
from pydantic import BaseModel


class DeviationData(BaseModel):
    site_plant: Optional[str] = None
    date_of_occurrence: Optional[str] = None
    title: Optional[str] = None
    source: Optional[str] = None
    related_product: Optional[str] = None
    batch_number: Optional[str] = None
    detailed_description: Optional[str] = None
    parameter: Optional[str] = None
    actual_value: Optional[str] = None
    expected_range: Optional[str] = None
    duration: Optional[str] = None
    immediate_action: Optional[str] = None
    detected_by: Optional[str] = None


class ImpactAssessment(BaseModel):
    impact: Optional[str] = None
    severity: Optional[str] = None
    reason: Optional[str] = None


class SaveDeviationRequest(BaseModel):
    site_plant: Optional[str] = None
    date_of_occurrence: Optional[str] = None
    title: Optional[str] = None
    source: Optional[str] = None
    related_product: Optional[str] = None
    batch_number: Optional[str] = None
    detailed_description: Optional[str] = None
    parameter: Optional[str] = None
    actual_value: Optional[str] = None
    expected_range: Optional[str] = None
    duration: Optional[str] = None
    immediate_action: Optional[str] = None
    detected_by: Optional[str] = None

    impact: Optional[str] = None
    severity: Optional[str] = None
    assessment_reason: Optional[str] = None    