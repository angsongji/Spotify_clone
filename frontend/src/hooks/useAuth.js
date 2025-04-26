import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../redux/slices/userSlice';
import { fetchUserById } from '../services/musicService';
import { message } from 'antd';

export function useAuth() {
    const dispatch = useDispatch();
    const { userId, user } = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetchUserById(userId);
                const fullUser = res?.data?.message;

                if (!fullUser?.id) throw new Error('Invalid user');

                dispatch(setUser(fullUser));
            } catch (error) {
                console.error('Auth error:', error);
                message.error('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        if (userId && !user && loading) {
            loadUser();
        } else setLoading(false);
    }, [userId]);

    return {
        isAuthenticated: Boolean(userId && user),
        user,
        loading
    };
}
