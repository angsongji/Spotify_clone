import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { message } from 'antd';
import { signIn } from "../services/authService";
import { setUser, setUserId } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { GrFormNextLink } from "react-icons/gr";
const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await signIn(formData);

            const data = response.data;
            if (data.success) {
                // Lưu thông tin user vào localStorage và context
                dispatch(setUserId(data.data.id));
                dispatch(setUser(data.data));

                message.success({
                    content: "Đăng nhập thành công!",
                    duration: 2,
                    style: { marginTop: '20vh' },
                });
                navigate('/');
            } else {
                message.error({
                    content: data.message,
                    duration: 3,
                    style: { marginTop: '20vh' },
                });
            }
        } catch (error) {
            message.error({
                content: 'Có lỗi xảy ra, vui lòng thử lại sau',
                duration: 3,
                style: { marginTop: '20vh' },
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black ">
            <div className='absolute flex gap-2 top-[3vw] left-[3vw]  items-center cursor-pointer' onClick={() => navigate("/")}>
                <FaSpotify className="text-[var(--main-green)] text-4xl " />
                <div className='text-3xl font-bold text-[var(--light-gray3)]'>Spotify</div>
            </div>
            <div className="w-full max-w-[30vw] bg-[var(--dark-gray)] rounded-lg shadow-lg pt-20 px-10 pb-2" style={{ 'box-shadow': 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}>
                <div className="flex flex-col items-center mb-10">

                    <div className="text-[var(--light-gray3)] text-xl font-bold">Đăng nhập</div>
                </div>

                <form onSubmit={handleSubmit} className=" w-full  flex flex-col justify-center gap-10  !text-[var(--light-gray3)]">

                    <div className=''>
                        <div className="input-animation ">
                            <input name="email"
                                placeholder=" "
                                type="email"
                                className='border-1 !border-[var(--light-gray2)] '
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading} />
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <div className='flex gap-2 '>
                        {/* Input sẽ chiếm phần còn lại */}
                        <div className='flex-1'>
                            <div className="input-animation">
                                <input
                                    name="password"
                                    placeholder=" "
                                    type={showPass ? "text" : "password"}
                                    className='w-full border-1 !border-[var(--light-gray2)]'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                                <label htmlFor="password">Mật khẩu</label>
                            </div>
                        </div>

                        {/* Phần tử còn lại */}
                        <div className='text-[var(--light-gray3)] text-2xl flex items-center cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <FaRegEyeSlash /> : <FaRegEye />}</div>
                    </div>


                    <div className='flex items-center justify-center'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={` w-fit  !mt-15 !mb-5 px-10   rounded-full font-medium text-white self-center
                            ${isLoading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'border-[var(--light-gray2)] border-1 hover:bg-[#1ed760]  transform hover:scale-105 transition-all  cursor-pointer'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center my-3">
                                    <svg className="animate-spin h-5 w-5 " viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>

                                </div>
                            ) : <GrFormNextLink size={40} className='text-[var(--light-gray2)] ' />}
                        </button>
                    </div>

                </form>

                <div className=" text-center text-sm">
                    <p className="text-gray-400">
                        Chưa có tài khoản?{' '}
                        <span onClick={() => navigate("/sign-up")} className="cursor-pointer text-[#1DB954] hover:text-[#1ed760] font-medium">
                            Đăng ký ngay
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};


export default SignIn;