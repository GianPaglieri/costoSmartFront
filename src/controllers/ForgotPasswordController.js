// src/controllers/ForgotPasswordController.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://149.50.131.253';

const requestPasswordReset = async (email) => {
  const res = await axios.post(`${API_URL}/api/users/request-password-reset`, { email });
  return res.data;
};

export default { requestPasswordReset };
