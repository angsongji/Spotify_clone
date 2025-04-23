import axiosClient from './axiosClient';


const createPayment = (price, userId, duration, title) => {
    return axiosClient.post('momo_api/create/', {
        amount: price,
        userId,
        duration,
        content: title,
    });
};

export { createPayment };
