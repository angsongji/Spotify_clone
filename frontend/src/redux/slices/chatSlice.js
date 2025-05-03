import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [], // Danh sách các phòng chat
        messages: [], // Lưu trữ tin nhắn theo chat_id
        onlineUsers: [], // Id của người dùng đang online
        isShowChatList: false,
        globalSocket: null,  // Lưu trữ WebSocket
        socketStatus: 'disconnected', // Trạng thái kết nối WebSocket
    },
    reducers: {
        // Cập nhật danh sách các phòng chat
        setChats: (state, action) => {
            state.chats = [...state.chats, ...action.payload];
        },

        addChat: (state, action) => {
            state.chats = [...state.chats, action.payload];
        },

        setMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },
        // Thêm tin nhắn vào đúng phòng chat
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },

        // Cập nhật trạng thái hiển thị danh sách phòng chat
        setIsShowChatList: (state, action) => {
            state.isShowChatList = action.payload;
        },

        // Cập nhật WebSocket
        setGlobalSocket: (state, action) => {
            state.globalSocket = action.payload;
        },

        // Cập nhật trạng thái kết nối WebSocket
        setSocketStatus: (state, action) => {
            state.socketStatus = action.payload;
        },

        // Cập nhật trạng thái online/offline của người dùng
        setOnlineUsers: (state, action) => {
            const { userId, users } = action.payload;
            const filter = users.filter((item) => item !== userId);
            state.onlineUsers = filter;
        },

        // Cập nhật trạng thái online/offline cho từng người dùng
        updateUserStatus: (state, action) => {
            const { userId, status } = action.payload;
            const onlineSet = new Set(state.onlineUsers);

            if (status === 'online') {
                onlineSet.add(userId);
            } else {
                onlineSet.delete(userId);
            }

            state.onlineUsers = [...onlineSet];  // Chuyển lại thành mảng và lưu vào state
        },
        updateMessageStatus: (state, action) => {
            const { chatId, fromStatus = "not seen", toStatus = "" } = action.payload;
            state.messages = state.messages.map(msg => {
                if (msg.chat_id === chatId && msg.status === fromStatus) {
                    return { ...msg, status: toStatus };
                }
                return msg;
            });
        },

    },
});

export const { setChats, addChat, setMessages, addMessage, setIsShowChatList, setGlobalSocket, setSocketStatus, setOnlineUsers, updateUserStatus, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
// selectors/chatSelectors.js (hoặc cùng file chatSlice.js cũng được)

