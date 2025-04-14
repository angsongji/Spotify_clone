// frontend/src/components/MomoPayment.jsx
import React, { useState } from 'react';

function Payment() {
    const [qrUrl, setQrUrl] = useState('');
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState(0);

    const handlePay = async () => {
        if (!amount || amount <= 0) {
            setMessage('Vui lòng nhập số tiền hợp lệ');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/momo_api/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount, userId: '12345', }),
            });

            const data = await response.json();

            if (data.payUrl) {
                window.open(data.payUrl, '_blank');
                setQrUrl(data.qrCodeUrl || '');
                setMessage('Vui lòng quét mã để thanh toán');
            } else {
                setMessage('Không tạo được thanh toán.');
            }
        } catch (err) {
            setMessage('Lỗi khi tạo thanh toán.');
        }
    };

    return (
        <div className='flex items-center flex-col justify-center h-screen bg-gray-100'>
            <h2>Thanh toán Momo</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                style={{ padding: 8 }}
                className='bg-gray-200 outline-none'
            />
            <br />
            <button onClick={handlePay} style={{ marginTop: 10 }} className='bg-red-200 p-2 rounded-sm cursor-pointer'>Thanh toán</button>
            <p>{message}</p>
            {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: 300 }} />}
        </div>
    );
}

export default Payment;
