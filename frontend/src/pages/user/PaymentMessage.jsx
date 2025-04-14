// src/components/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const PaymentMessage = () => {
    const [status, setStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 2000);
    }, [status]);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('orderId');
        const resultCode = queryParams.get('resultCode');

        if (orderId) {
            setOrderId(orderId);
            if (resultCode === '0') {
                setStatus('success');
            } else {
                setStatus('fail');
            }
        }
    }, [location]);

    return (
        <div>
            <h2>Thanh toán {status}</h2>
            <p>Đơn hàng: {orderId}</p>
            {status === 'success' ? (
                <p>Chúc mừng bạn đã thanh toán thành công!</p>
            ) : (
                <p>Thanh toán thất bại! Vui lòng thử lại sau.</p>
            )}
            <p>Chúng tôi đang chuyển hướng bạn về trang chủ.....</p>
        </div>
    );
};

export default PaymentMessage;
