import { addMessage, updateUserStatus, setOnlineUsers, setChats, setMessages, addChat, setIsShowChatList } from "./slices/chatSlice";
import { fetchChats, fetchMessages } from "../services/messageService";
import { message } from "antd";
let globalSocket = null;

export const initGlobalWebSocket = async (dispatch, userId) => {
    if (globalSocket) return;

    globalSocket = new WebSocket(`ws://3.82.187.90:8000/ws/chat/global/${userId}/`);

    globalSocket.onopen = async () => {
        console.log('✅ Global WebSocket connected');

        try {
            // Gọi API để lấy danh sách các phòng chat
            const resChats = await fetchChats(userId);
            const rooms = resChats.data.message || [];
            dispatch(setChats(rooms));

            // Gọi API để lấy tin nhắn cho từng phòng
            for (const room of rooms) {
                const resMessages = await fetchMessages(room.id);
                dispatch(setMessages(resMessages.data.message || []));
            }
        } catch (err) {
            console.error("❌ Lỗi khi load rooms/messages sau WebSocket:", err);
        }
    };

    globalSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'online_users':
                dispatch(setOnlineUsers({ userId, users: data.users }));
                break;

            case 'user_status':
                dispatch(updateUserStatus({ userId: data.user_id, status: data.status }));
                dispatch(addMessage({
                    chat_id: data.chat_id,
                    content: `${data.user_id} is now ${data.status}`,
                    sender_id: null,
                    system: true,
                }));
                break;

            case 'message':
                if (data.message.sender_id != userId) {
                    const newMessage = { ...data.message, status: data.status };
                    dispatch(addMessage(newMessage));
                }
                else dispatch(addMessage(data.message));
                break;

            case 'chat':
                const chat = data.data;
                if (chat.users_data.some(item => item.id === userId)) {
                    dispatch(addChat(chat))
                    message.success("Tạo đoạn chat thành công!");
                }
                break;
            case 'error':
                console.error("❌ Message error:", data.message);
                break;

            default:
                console.warn('ℹ️ Unknown message type:', data);
        }
    };

    globalSocket.onclose = () => {
        console.log('❌ Global WebSocket disconnected');
        globalSocket = null;
    };
};


export const sendGlobalMessage = ({ chatId, senderId, content }) => {
    if (!globalSocket || globalSocket.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ WebSocket chưa sẵn sàng!");
        return;
    }

    // Gửi tin nhắn qua WebSocket
    globalSocket.send(JSON.stringify({
        type: "message",
        chat_id: chatId, // Chỉ định chatId của phòng chat
        sender_id: senderId, // ID của người gửi
        content: content // Nội dung tin nhắn
    }));
};
export const createChatGlobal = ({ name, users }) => {
    if (!globalSocket || globalSocket.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ WebSocket chưa sẵn sàng!");
        return;
    }

    // Tạo đoạn chat qua WebSocket
    globalSocket.send(JSON.stringify({
        type: "chat",
        name: name, // Tên phòng chat
        users: users, // ID của các người trong đoạn chat
    }));
};

export const disconnectGlobalWebSocket = () => {
    if (globalSocket) {

        globalSocket.close(); // Đóng kết nối
        globalSocket = null;  // Reset biến
        console.log("👋 Global WebSocket manually disconnected");

    }
};


