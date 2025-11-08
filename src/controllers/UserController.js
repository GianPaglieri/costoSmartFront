import api from '../components/AxiosConfig';

export const changePassword = async ({ currentPassword, newPassword }) => {
  const payload = { currentPassword, newPassword };
  const { data } = await api.post('/users/change-password', payload);
  return data;
};

export default {
  changePassword,
};
