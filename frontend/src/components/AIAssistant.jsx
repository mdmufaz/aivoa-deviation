import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  setInputText,
  setDeviation,
  setAssessment,
  setLoading,
  setError,
} from "../features/deviation/deviationSlice";

function AIAssistant() {
  const dispatch = useDispatch();

  const {
    inputText,
    deviation,
    assessment,
    loading,
    error,
  } = useSelector((state) => state.deviation);

  const [editInstruction, setEditInstruction] = useState("");

  // Analyze pasted text
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      dispatch(setError("Please enter deviation text first."));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/deviations/analyze",
        {
          text: inputText,
        }
      );

      dispatch(setDeviation(response.data.deviation));
      dispatch(setAssessment(response.data.assessment));
    } catch (error) {
      console.error(error);
      dispatch(setError("Failed to analyze deviation."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Analyze uploaded PDF
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/deviations/analyze-pdf",
        formData
      );

      dispatch(setInputText(response.data.extracted_text));
      dispatch(setDeviation(response.data.deviation));
      dispatch(setAssessment(response.data.assessment));
    } catch (error) {
      console.error(error);
      dispatch(setError("Failed to analyze PDF."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // AI natural-language edit
  const handleEdit = async () => {
    if (!editInstruction.trim()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/deviations/edit",
        {
          deviation: deviation,
          instruction: editInstruction,
        }
      );

      dispatch(setDeviation(response.data.deviation));
      setEditInstruction("");
    } catch (error) {
      console.error(error);
      dispatch(setError("Failed to update deviation."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div>
          <h2>AI Deviation Assistant</h2>
          <p>
            Extract, assess and update deviation information
            using AI.
          </p>
        </div>

        <span className="ai-status">
          AI Assistant
        </span>
      </div>

      {/* PDF Upload */}
      <div className="ai-section">
        <h3>1. Upload Deviation Document</h3>

        <div className="upload-box">
          <div className="upload-icon">PDF</div>

          <div>
            <strong>Upload a deviation PDF</strong>
            <p>
              The document will be extracted and analyzed
              automatically.
            </p>
          </div>

          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
          />
        </div>
      </div>

      {/* Text Input */}
      <div className="ai-section">
        <h3>2. Enter Deviation Text</h3>

        <textarea
          className="ai-textarea"
          value={inputText}
          onChange={(e) =>
            dispatch(setInputText(e.target.value))
          }
          placeholder="Paste a deviation report, email, or incident description..."
          rows={8}
        />

        <button
          className="primary-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Deviation"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Assessment */}
      {assessment && (
        <div className="assessment-card">
          <div className="assessment-header">
            <h3>AI Assessment</h3>
            <span>Preliminary</span>
          </div>

          <div className="assessment-grid">
            <div className="assessment-item">
              <span>Impact</span>
              <strong>
                {assessment.impact || "Not assessed"}
              </strong>
            </div>

            <div className="assessment-item">
              <span>Severity</span>
              <strong>
                {assessment.severity || "Not assessed"}
              </strong>
            </div>
          </div>

          <div className="reason-box">
            <span>Reason</span>
            <p>
              {assessment.reason ||
                "No assessment reason available."}
            </p>
          </div>

          <div className="review-note">
            AI assessment is preliminary. Quality review
            is required before final disposition.
          </div>
        </div>
      )}

      {/* AI Edit */}
      <div className="ai-section">
        <h3>3. Edit Deviation with AI</h3>

        <p className="section-description">
          Tell the AI what you want to change in the
          populated form.
        </p>

        <textarea
          className="ai-textarea"
          value={editInstruction}
          onChange={(e) =>
            setEditInstruction(e.target.value)
          }
          placeholder="Example: Change the batch number to B24092 and source to Production"
          rows={4}
        />

        <button
          className="secondary-button"
          onClick={handleEdit}
          disabled={loading || !deviation}
        >
          {loading ? "Updating..." : "Apply AI Edit"}
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;