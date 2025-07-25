// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/token/';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    return response.data;
  } catch  {
    return null;
  }
};
