
import { useState, useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { FaPaperPlane } from "react-icons/fa";
import { sendGlobalMessage } from "../../redux/websocketGlobal";
import { updateMessageStatus } from '../../redux/slices/chatSlice';
const ChatWindow = ({ chat, setIsShowMessage, setSelectedChatId }) => {

    const user = useSelector(state => state.user.user);
    const messages = useSelector(state => state.chat.messages);
    const onlineUsers = useSelector(state => state.chat.onlineUsers);
    const messagesByChatId = messages.filter((msg) => msg.chat_id === chat.id);
    const dispatch = useDispatch();
    messagesByChatId.forEach(item => {
        if (item.status === "not seen") {
            dispatch(updateMessageStatus({
                chatId: chat.id,
                fromStatus: "not seen",
                toStatus: ""
            }));
        }
    });

    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const online = onlineUsers.some((item) => item != user.id && chat.users_data.some(u => u.id === item));
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesByChatId]);
    if (!chat) {
        return <div className="p-4 text-gray-500">Không tìm thấy phòng chat.</div>;
    }
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        sendGlobalMessage({
            chatId: chat.id,
            senderId: user.id,
            content: message,
        });

        setMessage('');


    };

    const renderMessages = () => {
        if (!messagesByChatId) return null;

        return messagesByChatId.map((msg, index) => {
            const isCurrentUser = msg.sender_id === user.id;
            const isSameSenderAsPrevious = index > 0 && messagesByChatId[index - 1].sender_id === msg.sender_id;
            const sender = chat.users_data.find((u) => u.id === msg.sender_id);

            const currentDateObj = new Date(msg.timestamp);
            const previousDateObj = index > 0 ? new Date(messagesByChatId[index - 1].timestamp) : null;

            const currentDate = currentDateObj.toLocaleDateString('vi-VN');
            const previousDate = previousDateObj?.toLocaleDateString('vi-VN');

            const time = currentDateObj.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });

            return (
                <div key={index}>
                    {currentDate !== previousDate && (
                        <div className="text-center text-xs text-gray-500 my-2">{currentDate}</div>
                    )}

                    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {!isCurrentUser && !isSameSenderAsPrevious && sender && (
                            <img
                                loading="lazy"
                                src={sender.avatar}
                                alt="Avatar"
                                className="w-8 h-8 object-cover rounded-full"
                            />
                        )}
                        {!isCurrentUser && isSameSenderAsPrevious && <div className="w-8 h-8" />}

                        <div className="flex flex-col max-w-[75%]">
                            <div className={`px-4 py-2 rounded-xl text-sm ${isCurrentUser
                                ? 'bg-gradient-to-tl from-green-600 to-[var(--main-green)] text-white rounded-br-none'
                                : 'bg-gray-200 text-black rounded-bl-none'}`}>
                                {msg.content}
                            </div>
                            <span className={`text-[10px] text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                {time}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });
    };



    return (
        <div className="w-[25vw] h-[70vh] flex flex-col absolute bottom-1 right-[75%] rounded-xl shadow-lg bg-white  z-10">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--light-gray3)]">
                <div className="flex items-center gap-2">
                    <div className="relative bg-[var(--light-gray3)] rounded-full ">
                        <img
                            loading="lazy"
                            src={chat.users_data.length < 3
                                ? chat.users_data.find((item) => item.id !== user.id)?.avatar
                                : '/user.png'}
                            alt=""
                            className="w-8 h-8 object-cover aspect-square rounded-full"
                        />
                        {online && <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>}
                    </div>
                    <div className="flex flex-col w-fit">
                        <span className="text-base font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                            {chat.users_data.length < 3
                                ? chat.users_data.find((item) => item.id !== user.id)?.name
                                : chat.name}
                        </span>
                        {online && <span className="text-xs text-[var(--light-gray3)]">Đang hoạt động</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3 text-[var(--main-purple)] text-xl">
                    <div className="cursor-pointer" onClick={() => { setSelectedChatId(""); setIsShowMessage(false) }}>
                        <HiX />
                    </div>
                </div>
            </div>

            {/* KHUNG HIỂN THỊ TIN NHẮN */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {renderMessages()}
                <div ref={messagesEndRef} />
            </div>



            {/* THANH NHẬP TIN NHẮN */}
            <form onSubmit={sendMessage}>
                <div className="flex items-center border-t border-[var(--light-gray3)] px-4 py-2 gap-5">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Aa"
                        className="flex-1 py-1 px-2 bg-gray-200 rounded-full focus:outline-none"
                    />
                    <button type="submit" className="cursor-pointer">
                        <FaPaperPlane size={20} className="text-[var(--main-green)]" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;