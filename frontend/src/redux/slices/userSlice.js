import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: localStorage.getItem("user") || "", // Lưu ID người dùng
    user: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
            localStorage.setItem("user", action.payload);
            state.isAuthenticated = true;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            localStorage.removeItem("user");
            state.userId = "";
            state.user = null;
            state.isAuthenticated = false;

        },
    },
});

export const { setUserId, setUser, logout } = userSlice.actions;

export default userSlice.reducer;
