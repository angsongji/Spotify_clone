import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { signUp } from "../services/authService";
const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra password match
        if (formData.password !== formData.confirmPassword) {
            console.log('sai');
            message.error('Mật khẩu không khớp!');
            return;
        }

        setIsLoading(true);

        try {

            const dataAccount = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            const response = await signUp(dataAccount);

            const data = response.data;
            console.log('Response:', data);

            if (data.success) {
                message.success({
                    content: 'Đăng ký thành công!',
                    duration: 2
                });
                setTimeout(() => {
                    navigate('/sign-in');
                }, 1000);
            } else {
                message.error({
                    content: data.message || 'Đăng ký thất bại',
                    duration: 3
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            message.error({
                content: 'Lỗi kết nối server',
                duration: 3
            });

        } finally {
            setIsLoading(false);
        }
    };

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1e1e1e] to-black p-4">
            <div className="w-full max-w-md bg-[#121212] rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center mb-8">
                    <FaSpotify className="text-[#1DB954] text-5xl mb-4" />
                    <h2 className="text-white text-2xl font-bold">Đăng ký tài khoản Spotify</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Tên hiển thị
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-medium text-white flex items-center justify-center
                            ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 cursor-pointer'}`}
                    >
                        {isLoading ? (
                            <div className='flex gap-2'>
                                <Spin indicator={antIcon} />
                                Đang xử lý...
                            </div>
                        ) : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Đã có tài khoản?{' '}
                        <Link to="/sign-in" className="text-[#1DB954] hover:text-[#1ed760] font-medium">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
