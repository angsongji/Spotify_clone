import { FaSearch, FaTimes, FaPlus, FaPaperPlane, FaRunning } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { HiMiniArrowRight } from "react-icons/hi2";
import { useMusic } from "../../context/MusicContext";
import { HiX } from "react-icons/hi";
import { useApi } from "../../context/ApiContext";
import { IoMdText, IoMdPersonAdd } from "react-icons/io";
import { MdOutlineGroupAdd } from "react-icons/md";
import { Select, message } from "antd";
const { Option } = Select;
const ChatList = () => {
    const { user, fetchUsers, fetchData } = useApi();
    const [chats, setChats] = useState(user.chats_data || []);
    const [searchValue, setSearchValue] = useState("");
    const { isShowChatList, setIsShowChatList } = useMusic();
    const [isShowFormAdd, setIsShowFormAdd] = useState(false);
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const fetchDataUsers = async () => {
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers.message);
        };
        fetchDataUsers();
    }, []);

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleShowMessage = (chat_id) => {
        setSelectedChatId(chat_id);
        setIsShowMessage(true);
    };

    const ChatWindow = ({ chat }) => {
        const [socket, setSocket] = useState(null);
        const [message, setMessage] = useState('');
        const [messages, setMessages] = useState(chat.messages_data || []);
        const messagesEndRef = useRef(null);

        // Cập nhật messages khi chat thay đổi
        useEffect(() => {
            setMessages(chat.messages_data || []);
        }, [chat]);

        // Tự động cuộn xuống cuối khung chat
        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages]);

        // Thiết lập WebSocket
        useEffect(() => {
            const socketInstance = new WebSocket(`ws://localhost:8000/ws/chat/${chat.id}/`);

            socketInstance.onopen = () => {
                console.log("✅ Connected to WebSocket");
            };

            socketInstance.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setMessages((prev) => [...prev, data]);
                } catch (err) {
                    console.error("❌ JSON parse error:", err);
                }
            };

            socketInstance.onerror = (error) => {
                console.error("WebSocket Error:", error);
            };

            socketInstance.onclose = () => {
                console.log("WebSocket connection closed");
            };

            setSocket(socketInstance);

            return () => {
                socketInstance.close();
            };
        }, [chat.id]);

        const sendMessage = (e) => {
            e.preventDefault();
            if (socket && message) {
                const data = {
                    chat_id: chat.id,
                    sender_id: user.id,
                    content: message
                };
                socket.send(JSON.stringify(data));
                setMessage('');
            }
        };

        return (
            <div className="w-[25vw] h-[70vh] flex flex-col absolute bottom-0 top-0 right-[10vw] rounded-xl shadow-lg bg-white border">
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--light-gray3)]">
                    <div className="flex items-center gap-2">
                        <div className="relative bg-[var(--light-gray3)] rounded-full">
                            <img
                                src={chat.users_data.length < 3
                                    ? chat.users_data.find((item) => item.id !== user.id)?.avatar
                                    : "/user.png"}
                                alt=""
                                className="w-8 h-8 object-cover aspect-square rounded-full"
                            />
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex flex-col w-fit">
                            <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                                {chat.users_data.length < 3
                                    ? chat.users_data.find((item) => item.id !== user.id)?.name
                                    : chat.name}
                            </span>
                            <span className="text-xs text-[var(--light-gray3)]">Đang hoạt động</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--main-purple)] text-xl">
                        {/* Nếu có chức năng thì thêm vào */}
                        {/* <FaPlus className="cursor-pointer" /> */}
                        {/* <IoMdPersonAdd className="cursor-pointer" /> */}
                        {/* <FaRunning className="cursor-pointer" /> */}
                        <div className="cursor-pointer" onClick={() => setIsShowMessage(false)}>
                            <FaTimes />
                        </div>

                    </div>
                </div>

                {/* KHUNG HIỂN THỊ TIN NHẮN */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.sender_id === user.id;
                        const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;
                        const sender = chat.users_data.find((u) => u.id === msg.sender_id);

                        const currentDateObj = new Date(msg.timestamp);
                        const previousDateObj = index > 0 ? new Date(messages[index - 1].timestamp) : null;

                        const currentDate = currentDateObj.toLocaleDateString('vi-VN');
                        const previousDate = previousDateObj?.toLocaleDateString('vi-VN');

                        const time = currentDateObj.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <div key={index}>
                                {/* Hiển thị ngày nếu khác với tin nhắn trước */}
                                {currentDate !== previousDate && (
                                    <div className="text-center text-xs text-gray-500 my-2">{currentDate}</div>
                                )}

                                <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    {!isCurrentUser && !isSameSenderAsPrevious && sender && (
                                        <img
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
                    })}

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

    const ComponentChat = ({ chat }) => (
        <div
            onClick={() => handleShowMessage(chat.id)}
            className="text-[var(--light-gray3)] flex items-center gap-2 cursor-pointer hover:text-white"
        >
            <img
                src={chat.users_data.length < 3
                    ? chat.users_data.find((item) => item.id !== user.id)?.avatar
                    : "/user.png"}
                alt=""
                className="w-7 h-7 object-cover aspect-square rounded-full"
            />
            <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                {chat.users_data.length > 2
                    ? chat.name
                    : chat.users_data.find((item) => item.id !== user.id)?.name}
            </div>
        </div>
    );

    const SearchUser = ({ user_by_name }) => {
        const handleTextMessage = () => {
            const existingPrivateChat = chats.find(chat =>
                chat.users_data.length === 2 &&
                chat.users_data.some(u => u.id === user_by_name.id)
            );

            if (existingPrivateChat) {
                setSearchValue("");
                handleShowMessage(existingPrivateChat.id);
            } else {
                alert('Chưa tồn tại đoạn chat 2 người với user này');
            }

        };

        return <div

            className="text-[var(--light-gray3)] flex items-center gap-2  hover:text-white justify-between"
        >
            <div className="flex gap-2 items-center">
                <img
                    src={user_by_name.avatar}
                    alt=""
                    className="w-7 h-7 object-cover aspect-square rounded-full"
                />
                <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis self-left">
                    {user_by_name.name}
                </div>
            </div>
            <div className="cursor-pointer" onClick={() => handleTextMessage()}>
                <IoMdText size={20} />
            </div>

        </div>
    }

    const FormAddChatGroup = ({ setChats }) => {
        const [nameGroup, setNameGroup] = useState("");
        const [selectedValues, setSelectedValues] = useState([]);
        const handleAddChatGroup = async (e) => {
            e.preventDefault();
            if (selectedValues.length < 2) {
                message.error("Chọn ít nhất 2 người để tạo nhóm");
                return;
            }
            const chatData = {
                name: nameGroup,
                users: [...new Set([...selectedValues, user.id])],  // thêm user.id và loại bỏ trùng lặp
            };

            try {
                const addChatResponse = await fetchData("add-chat/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(chatData),
                });

                if (addChatResponse && addChatResponse.status === 201) {
                    setChats((prevChats) => [...prevChats, addChatResponse.message]);
                    message.success("Tạo nhóm thành công!");
                    setIsShowFormAdd(false);

                } else {
                    throw new Error("Failed to add chat");
                }
            } catch (error) {
                console.error("Error adding chat:", error);
                message.error("Tạo nhóm thất bại!");
            }
        };
        const SelectMultipleWithSearch = ({ data }) => {

            const handleChange = (values) => {
                setSelectedValues(values);  // Cập nhật các giá trị đã chọn
            };

            return (
                <div>
                    <Select
                        mode="multiple"  // Cho phép chọn nhiều lựa chọn
                        value={selectedValues}   // Các giá trị đã chọn
                        onChange={handleChange}  // Cập nhật khi chọn hoặc bỏ chọn
                        placeholder="Chọn nhiều"
                        style={{
                            width: '100%'
                        }}
                        showSearch  // Bật tính năng tìm kiếm trong dropdown
                        filterOption={(input, option) => {
                            // Lọc các Option theo tên khi nhập tìm kiếm
                            return option.children.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {data.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div >
            );
        };
        return (
            <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">

                <form onSubmit={handleAddChatGroup} className="py-5 px-3 bg-[var(--dark-gray)] rounded-md shadow-md w-1/4 h-fit flex flex-col gap-5 text-[var(--light-gray3)]">
                    <HiX className="text-[var(--light-gray3)] text-2xl cursor-pointer self-end " onClick={() => setIsShowFormAdd(false)} />
                    <div className="flex flex-col gap-5  p-2">
                        <label htmlFor="name">Tên nhóm</label>
                        <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={nameGroup} onChange={(e) => setNameGroup(e.target.value)} />


                    </div>
                    <div className="p-2">
                        <SelectMultipleWithSearch data={users.filter((item) => item.id !== user.id)} />
                    </div>
                    <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Tạo nhóm</button>
                </form>
            </div>

        );
    }
    return (
        <>
            {isShowChatList && (
                <div className="w-full h-full p-2">

                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                className="bg-[var(--light-gray2)] !text-white p-2  rounded-full flex-1 focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                                value={searchValue}
                                onChange={handleInputChange}
                            />
                            <FaSearch size={17} className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
                        </div>
                        <div className="flex items-center justify-end" onClick={() => setIsShowFormAdd(true)}>
                            <MdOutlineGroupAdd className="text-[var(--light-gray3)] cursor-pointer" size={25} />
                        </div>
                        <div className="flex items-center justify-end " onClick={() => setIsShowChatList(false)}>
                            <HiMiniArrowRight className="text-[var(--light-gray3)] cursor-pointer" size={25} />
                        </div>
                    </div >

                    {
                        searchValue !== "" ? (
                            <div className="flex flex-col gap-2 py-4 pr-2">
                                {
                                    users
                                        .filter(item =>
                                            item.name.toLowerCase().includes(searchValue.toLowerCase())
                                        )
                                        .map(item => (
                                            <SearchUser key={item._id} user_by_name={item} />
                                        ))
                                }

                            </div>
                        ) : (
                            <div className="relative flex flex-col gap-2 py-4 pr-2">
                                {chats?.map((chat, index) => (
                                    <div key={index}>
                                        <ComponentChat chat={chat} />
                                        {isShowMessage && selectedChatId === chat.id && <ChatWindow chat={chat} />}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {isShowFormAdd && <FormAddChatGroup setChats={setChats} />}
                </div >
            )}
        </>
    );
};

export default ChatList;
