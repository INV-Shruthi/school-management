import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import studentReducer from "./features/studentSlice";
import teacherReducer from "./features/teacherSlice";
import userReducer from "./features/userSlice";

export const store  = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    users: userReducer, 
  },
});
