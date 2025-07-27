import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async ({ page }) => {
    const stringedToken = localStorage.getItem("authTokens"); // or get from context/store
    const authToken = JSON.parse(stringedToken);
    const res = await axios.get(`http://127.0.0.1:8000/api/teachers/`, {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        // "Cache-Control": "no-cache",
        // Pragma: "no-cache",
        // Expires: "0",
      },
    });
    return res.data;
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    teachers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeachers.fulfilled, (state, action) => {
      state.data = action.payload.results;
      state.total = action.payload.count;
    });
  },
});

export default teacherSlice.reducer;
