import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ page }) => {
    const stringedToken = localStorage.getItem("authTokens"); // or get from context/store
    const authToken = JSON.parse(stringedToken); // const role = getState().auth.user?.role;
    const res = await axios.get(`http://127.0.0.1:8000/api/students/`, {
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

const studentSlice = createSlice({
  name: "students",
  initialState: { data: [], total: 0, page: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.data = action.payload.results;
      state.total = action.payload.count;
    });
  },
});

export default studentSlice.reducer;
