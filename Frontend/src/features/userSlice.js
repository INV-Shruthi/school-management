import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const stringedToken = localStorage.getItem("authTokens");
  const authToken = JSON.parse(stringedToken);
  const response = await axios.get(`http://127.0.0.1:8000/api/users/`, {
    headers: {
      Authorization: `Bearer ${authToken.access}`,
    },
  });
  return response.data;
});

// Thunk: Add a new user
export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/users/",
    userData
  );
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
    page: 1,
    total: 0,
    rowsPerPage: 10,
  },
  reducers: {},
   extraReducers: (builder) => {
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload.results;
        state.total = action.payload.count;
      });
    },
});

export default userSlice.reducer;
