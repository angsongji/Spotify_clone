import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { FaSpotify } from 'react-icons/fa';
import { message } from 'antd';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useApi();

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
        console.log('Sending login data:', {
          formData
      });
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Login response:', data);
            if (data.success) {
                // Lưu thông tin user vào localStorage và context
                localStorage.setItem('user', JSON.stringify(data.data));
                setUser(data.data);

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1e1e1e] to-black p-4">
            <div className="w-full max-w-md bg-[#121212] rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center mb-8">
                    <FaSpotify className="text-[#1DB954] text-5xl mb-4" />
                    <h2 className="text-white text-2xl font-bold">Đăng nhập vào Spotify</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            placeholder="name@domain.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-medium text-white 
                            ${isLoading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-[#1DB954] hover:bg-[#1ed760] transform hover:scale-105 transition-all'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý...
                            </div>
                        ) : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Chưa có tài khoản?{' '}
                        <a href="/sign-up" className="text-[#1DB954] hover:text-[#1ed760] font-medium">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};


export default SignIn;