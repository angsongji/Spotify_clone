import { configureStore } from "@reduxjs/toolkit";
import musicReducer from "./slices/musicSlice";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
export const store = configureStore({
    reducer: {
        music: musicReducer,  // ← đây sẽ thành `state.music`
        user: userReducer,  // ← và đây thành `state.user`
        chat: chatReducer,
    },
});
