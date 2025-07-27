import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async ({ page }, { getState }) => {
    const token = getState().auth.user?.access;
    const res = await axios.get(`http://127.0.0.1:8000/api/teachers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
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
  reducers: {
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
  },
});

export const { addTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
