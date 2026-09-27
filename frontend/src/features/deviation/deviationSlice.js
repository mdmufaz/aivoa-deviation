import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deviation: {},
  assessment: {},
  inputText: "",
  loading: false,
  error: null,
};

const deviationSlice = createSlice({
  name: "deviation",
  initialState,
  reducers: {
    setDeviation: (state, action) => {
      state.deviation = action.payload;
    },

    setAssessment: (state, action) => {
      state.assessment = action.payload;
    },

    setInputText: (state, action) => {
      state.inputText = action.payload;
    },

    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.deviation[field] = value;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDeviation,
  setAssessment,
  setInputText,
  updateField,
  setLoading,
  setError,
} = deviationSlice.actions;

export default deviationSlice.reducer;