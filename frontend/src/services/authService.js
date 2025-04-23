import axiosClient from './axiosClient';
const signUp = (formData) => axiosClient.post(`api/users/register/`, formData);
const signIn = (userData) => axiosClient.post(`api/users/login/`, userData);

export {
    signIn,
    signUp
};