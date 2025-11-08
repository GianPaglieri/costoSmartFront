// src/controllers/ForgotPasswordController.js
import api from '../components/AxiosConfig';

const requestPasswordReset = async (email) => {
  const res = await api.post(`/users/request-password-reset`, { email });
  return res.data;
};

export default { requestPasswordReset };
