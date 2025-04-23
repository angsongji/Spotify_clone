import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment } from '../../services/paymentService';
import { fetchUserById } from "../../services/musicService";
import { useSelector } from 'react-redux';
import {
    setUser
} from '../../redux/slices/userSlice';
const premiumData = [
    {
        id: 1,
        price: 10000,
        duration: 3, //day
        title: "Gói premium dùng thử",
        descriptions: [
            "Nghe toàn bộ các bài hát",
            "Xem video âm nhạc",
            "Tải video âm nhạc về máy"
        ]
    },
    {
        id: 2,
        price: 32000,
        duration: 14, //day
        title: "Gói premium chill",
        descriptions: [
            "Nghe toàn bộ các bài hát",
            "Xem video âm nhạc",
            "Tải video âm nhạc về máy"
        ]
    },
]
const Premium = () => {
    const user = useSelector(state => state.user.user);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'success' || status === 'fail') {
            const timeout = setTimeout(() => {
                navigate('/');
            }, 2000); // chuyển sau 2s
            return () => clearTimeout(timeout); // cleanup khi unmount
        }
    }, [status]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('orderId');
        const resultCode = queryParams.get('resultCode');

        if (orderId) {
            if (resultCode === '0') {

                const fetchDataUser = async () => {
                    const fetchedUser = await fetchUserById(user.id); // Giả sử storedUser có id.
                    console.log("fetchedUser", fetchedUser);
                    setUser(fetchedUser.data.message); // Cập nhật trạng thái user.
                    setStatus('success');
                    setMessage("Thanh toán thành công")
                };
                fetchDataUser(); // Gọi hàm bất đồng bộ để lấy dữ liệu người dùng.

            } else {
                setMessage("Thanh toán thất bại")
                setStatus('fail');
            }
        }
    }, [location, status]);
    const PurchasedPremiumCard = ({ title, price, duration, descriptions }) => {

        const handlePay = async () => {

            try {
                const response = await createPayment(price, user.id, duration, title);
                const data = response.data;
                const statusCode = response.status;
                if (statusCode >= 200 && statusCode < 300) {
                    if (data.payUrl) {
                        window.location.href = data.payUrl;
                        setMessage('Đang tiến hành thanh toán! Vui lòng quét mã để thanh toán ở trang MoMo vừa được mở!');
                    } else {
                        setMessage('Không tạo được thanh toán. MoMo không trả về đường dẫn thanh toán.');
                    }
                } else if (statusCode >= 400 && statusCode < 500) {
                    setMessage('Lỗi gửi yêu cầu thanh toán. Vui lòng kiểm tra lại thông tin và thử lại!');
                    console.error('Lỗi 4xx:', data);
                } else if (statusCode >= 500) {
                    setMessage('Hệ thống thanh toán phía Momo đang gặp sự cố. Vui lòng thử lại sau!');
                    console.error('Lỗi 5xx:', data);
                } else {
                    setMessage('Đã xảy ra lỗi không xác định.');
                    console.error('Lỗi không xác định:', statusCode, data);
                }

            } catch (err) {
                console.error("❌ Lỗi fetch MoMo:", err);
                setMessage('Lỗi khi tạo thanh toán. Không thể kết nối đến hệ thống.');
            }

        };

        return (
            <div className="bg-[var(--light-gray2)] p-5 pb-5 rounded-lg relative text-white w-full">
                <div className={`bg-[var(--main-green)] text-black text-sm font-semibold rounded-br-md px-3 py-1 inline-block absolute top-0 left-0`}>
                    {duration} ngày
                </div>
                <div className="mt-5 flex flex-col gap-2 text-left">
                    <h2 className="text-2xl font-bold ">{title}</h2>
                    <p className="text-sm text-[var(--main-green)] ">
                        <span className="text-base font-bold">{price} đ</span> dùng trong <span className="text-base font-bold">{duration} ngày</span>
                    </p>
                    <ul className="space-y-2 text-[var(--light-gray3)] self-center">
                        {descriptions.map((desc, index) => (
                            <li key={index}>+ {desc}</li>
                        ))}
                    </ul>
                    {/* Thêm nút "Mua" */}
                    <button
                        onClick={handlePay}
                        className=" self-center cursor-pointer w-fit px-6 py-2 bg-[var(--main-green)] text-white font-semibold rounded-lg hover:bg-green-600"
                    >
                        Mua
                    </button>
                </div>
            </div>
        );
    };
    return (
        <div className="bg-[#141414] text-center text-white ">
            <div className="pl-5 flex flex-col text-left justify-end  bg-gradient-to-t from-[rgb(20,20,20)]/20 via-[var(--main-green)] to-[rgb(20,20,20)] h-[40vh]" >
                <h1 className="text-5xl font-bold mb-3 text-white">Khám phá premium</h1>
                <p className="text-lg text-[var(--light-gray3)] mb-10">Tận hưởng âm nhạc không bị gián đoạn, cùng nhiều lợi ích khác!</p>
            </div>
            {
                message == '' && status === '' ?
                    (<>
                        <div className="text-center mt-20 mb-32">
                            <h2 className="text-2xl font-semibold">Spotify có các gói sau</h2>
                            <p className="text-gray-400 text-sm">Đơn giản và nhanh, chỉ với vài bước đơn giản bạn đã có thể tận hưởng âm nhạc không giới hạn!</p>
                        </div>

                        <div className=" grid grid-cols-3 gap-10 justify-center p-5">
                            {premiumData.map((item, index) => (
                                <PurchasedPremiumCard
                                    key={index}
                                    title={item.title}
                                    price={`${item.price}`}
                                    duration={`${item.duration}`}
                                    descriptions={item.descriptions}
                                />

                            ))}
                        </div>
                    </>
                    ) :
                    (
                        <>
                            <div className="text-center min-h-[50vh] flex flex-col justify-center items-center">
                                {
                                    status === '' ?
                                        <>
                                            <h2 className="text-2xl font-semibold">Bạn đang trong quá trình thanh toán</h2>
                                            <p className="text-gray-400 text-base">{message}</p>
                                        </> : status === 'success' ?
                                            <>
                                                <h2 className="text-2xl font-semibold">Hoàn tất thanh toán</h2>
                                                <p className="text-gray-400 text-base">{message}</p>
                                                <div>Đang chuyển hướng bạn về trang chủ.....</div>
                                            </> :
                                            <>
                                                <h2 className="text-2xl font-semibold">Hoàn tất thanh toán</h2>
                                                <p className="text-gray-400 text-base">{message}</p>
                                                <div>Đang chuyển hướng bạn về trang chủ.....</div>
                                            </>
                                }


                            </div>
                        </>

                    )
            }

        </div>
    );
};

export default Premium;