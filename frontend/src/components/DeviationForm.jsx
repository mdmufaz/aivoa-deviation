import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";

import {
  updateField,
  setError,
} from "../features/deviation/deviationSlice";

function DeviationForm() {
  const dispatch = useDispatch();

  const deviation = useSelector(
    (state) => state.deviation.deviation
  );

  const assessment = useSelector(
    (state) => state.deviation.assessment
  );
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (field, value) => {
    dispatch(
      updateField({
        field,
        value,
      })
    );
  };

 const handleSave = async () => {
  try {
    setSaveStatus({
      type: "loading",
      message: "Saving deviation...",
    });

    const payload = {
      ...deviation,
      impact: assessment.impact || null,
      severity: assessment.severity || null,
      assessment_reason: assessment.reason || null,
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/api/deviations",
      payload
    );

    setSaveStatus({
      type: "success",
      message: `Deviation saved successfully. ID: ${response.data.id}`,
    });
  } catch (error) {
    console.error(error);

    dispatch(setError("Failed to save deviation"));

    setSaveStatus({
      type: "error",
      message: "Failed to save deviation. Please try again.",
    });
  }
};

  return (
    <div className="deviation-form">

      <div className="form-header">
        <div>
          <h2>Log Deviation</h2>
          <p>
            Review and confirm the deviation information
            extracted by AI.
          </p>
        </div>

        <span className="review-badge">
          Human Review
        </span>
      </div>

      <div className="form-grid">

        {/* Site */}
        <div className="form-field">
          <label>Site / Plant</label>
          <input
            value={deviation.site_plant || ""}
            onChange={(e) =>
              handleChange(
                "site_plant",
                e.target.value
              )
            }
            placeholder="e.g. Bengaluru API Plant"
          />
        </div>

        {/* Date */}
        <div className="form-field">
          <label>Date of Occurrence</label>
          <input
            value={deviation.date_of_occurrence || ""}
            onChange={(e) =>
              handleChange(
                "date_of_occurrence",
                e.target.value
              )
            }
            placeholder="e.g. 27 September 2026"
          />
        </div>

        {/* Title */}
        <div className="form-field full-width">
          <label>Title / Short Description</label>
          <input
            value={deviation.title || ""}
            onChange={(e) =>
              handleChange(
                "title",
                e.target.value
              )
            }
            placeholder="Short description of the deviation"
          />
        </div>

        {/* Source */}
        <div className="form-field">
          <label>Source</label>
          <input
            value={deviation.source || ""}
            onChange={(e) =>
              handleChange(
                "source",
                e.target.value
              )
            }
            placeholder="e.g. Production"
          />
        </div>

        {/* Product */}
        <div className="form-field">
          <label>Related Product / Material</label>
          <input
            value={deviation.related_product || ""}
            onChange={(e) =>
              handleChange(
                "related_product",
                e.target.value
              )
            }
            placeholder="Product or material"
          />
        </div>

        {/* Batch */}
        <div className="form-field">
          <label>Batch / Lot Number</label>
          <input
            value={deviation.batch_number || ""}
            onChange={(e) =>
              handleChange(
                "batch_number",
                e.target.value
              )
            }
            placeholder="e.g. B24091"
          />
        </div>

        {/* Detected By */}
        <div className="form-field">
          <label>Detected By</label>
          <input
            value={deviation.detected_by || ""}
            onChange={(e) =>
              handleChange(
                "detected_by",
                e.target.value
              )
            }
            placeholder="Person / department"
          />
        </div>

        {/* Description */}
        <div className="form-field full-width">
          <label>Detailed Description</label>
          <textarea
            value={
              deviation.detailed_description || ""
            }
            onChange={(e) =>
              handleChange(
                "detailed_description",
                e.target.value
              )
            }
            rows={5}
            placeholder="Detailed description of what happened..."
          />
        </div>

        {/* Parameter */}
        <div className="form-field">
          <label>Parameter</label>
          <input
            value={deviation.parameter || ""}
            onChange={(e) =>
              handleChange(
                "parameter",
                e.target.value
              )
            }
            placeholder="e.g. Reactor temperature"
          />
        </div>

        {/* Actual Value */}
        <div className="form-field">
          <label>Actual Value</label>
          <input
            value={deviation.actual_value || ""}
            onChange={(e) =>
              handleChange(
                "actual_value",
                e.target.value
              )
            }
            placeholder="e.g. 82°C"
          />
        </div>

        {/* Expected Range */}
        <div className="form-field">
          <label>Expected Range</label>
          <input
            value={deviation.expected_range || ""}
            onChange={(e) =>
              handleChange(
                "expected_range",
                e.target.value
              )
            }
            placeholder="e.g. 75°C - 80°C"
          />
        </div>

        {/* Duration */}
        <div className="form-field">
          <label>Duration</label>
          <input
            value={deviation.duration || ""}
            onChange={(e) =>
              handleChange(
                "duration",
                e.target.value
              )
            }
            placeholder="e.g. 18 minutes"
          />
        </div>

        {/* Immediate Action */}
        <div className="form-field full-width">
          <label>Immediate Action</label>
          <textarea
            value={deviation.immediate_action || ""}
            onChange={(e) =>
              handleChange(
                "immediate_action",
                e.target.value
              )
            }
            rows={3}
            placeholder="Action taken immediately after the deviation..."
          />
        </div>

      </div>

      {/* AI Assessment */}
      <div className="form-assessment">

        <div className="assessment-title">
          <div>
            <h3>Initial Impact Assessment</h3>
            <p>
              AI-generated preliminary assessment for
              Quality review.
            </p>
          </div>

          <span>AI Assisted</span>
        </div>

        <div className="form-assessment-grid">

          <div className="assessment-box">
            <label>Initial Impact</label>

            <div className="assessment-value">
              {assessment?.impact ||
                "Not assessed"}
            </div>
          </div>

          <div className="assessment-box">
            <label>Initial Severity</label>

            <div className="assessment-value">
              {assessment?.severity ||
                "Not assessed"}
            </div>
          </div>

        </div>

        <div className="assessment-reason">
          <label>Assessment Reason</label>

          <p>
            {assessment?.reason ||
              "Run AI analysis to generate a preliminary assessment."}
          </p>
        </div>

        <div className="quality-note">
          <strong>Quality review required:</strong>{" "}
          AI output is preliminary and must be reviewed
          by an authorized Quality user before final
          disposition.
        </div>

      </div>

      {/* Save */}
      <div className="form-actions">

  {saveStatus && (
    <div className={`save-status ${saveStatus.type}`}>
      {saveStatus.type === "success" && "✓ "}
      {saveStatus.message}
    </div>
  )}

  <button
    className="save-button"
    onClick={handleSave}
    disabled={saveStatus?.type === "loading"}
  >
    {saveStatus?.type === "loading"
      ? "Saving..."
      : "Save Deviation"}
  </button>

</div>

    </div>
  );
}

export default DeviationForm;