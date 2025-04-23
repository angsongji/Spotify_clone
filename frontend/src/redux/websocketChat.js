import { setRooms, addMessage, setSocket, setSocketStatus } from './slices/chatSlice';


let socketInstance = null;
export const initChatWebSocket = (dispatch, chatId) => {
    if (socketInstance) return; // nếu đã kết nối thì không làm gì

    dispatch(setSocketStatus('connecting')); // Đang kết nối
    socketInstance = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);

    socketInstance.onopen = () => {
        console.log('✅ WebSocket connected');
        dispatch(setSocket(socketInstance)); // Lưu trữ WebSocket vào Redux
        dispatch(setSocketStatus('connected')); // Thay đổi trạng thái kết nối
    };

    socketInstance.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'room_list') {
                dispatch(setRooms(data.rooms));
            } else if (data.type === 'new_message') {
                dispatch(addMessage(data.message));
            }
            // setMessages((prev) => [...prev, data]);
        } catch (err) {
            console.error("❌ JSON parse error:", err);
        }
    };

    socketInstance.onerror = (error) => {
        console.error("WebSocket Error:", error);
        dispatch(setSocketStatus('error')); // Cập nhật trạng thái nếu có lỗi
    };

    socketInstance.onclose = () => {
        console.log("WebSocket connection closed");
        dispatch(setSocketStatus('disconnected')); // Cập nhật trạng thái ngắt kết nối
        socketInstance = null;
    };



    // socket = new WebSocket('ws://localhost:8000/ws/chat/');

    // socket.onopen = () => {
    //     console.log('✅ WebSocket connected');
    //     dispatch(setSocket(socket)); // Lưu trữ WebSocket vào Redux
    //     dispatch(setSocketStatus('connected')); // Thay đổi trạng thái kết nối
    // };

    // socket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);

    //     if (data.type === 'room_list') {
    //         dispatch(setRooms(data.rooms));
    //     } else if (data.type === 'new_message') {
    //         dispatch(addMessage(data.message));
    //     }
    // };

    // socket.onerror = (error) => {
    //     console.error('❌ WebSocket error', error);
    //     dispatch(setSocketStatus('error')); // Cập nhật trạng thái nếu có lỗi
    // };

    // socket.onclose = () => {
    //     console.log('❌ WebSocket disconnected');
    //     dispatch(setSocketStatus('disconnected')); // Cập nhật trạng thái ngắt kết nối
    //     socket = null;
    // };
};