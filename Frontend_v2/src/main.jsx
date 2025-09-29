import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { CustomThemeProvider } from "./context/ThemeContext";


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
