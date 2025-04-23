import { FaSearch, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { HiMiniArrowRight } from "react-icons/hi2";
import { HiX } from "react-icons/hi";
import { IoMdText } from "react-icons/io";
import { MdOutlineGroupAdd } from "react-icons/md";
import { Select, message } from "antd";
import { fetchUsers } from "../../services/musicService";
import { addChat } from "../../services/messageService";
import { useSelector, useDispatch } from 'react-redux';
import { setIsShowChatList, setChats, updateMessageStatus } from '../../redux/slices/chatSlice';
import { sendGlobalMessage } from "../../redux/websocketGlobal";

const { Option } = Select;
const ChatList = () => {
    const user = useSelector(state => state.user.user);
    const isShowChatList = useSelector(state => state.chat.isShowChatList);
    const onlineUsers = useSelector(state => state.chat.onlineUsers);
    const chats = useSelector(state => state.chat.chats);
    const messages = useSelector(state => state.chat.messages);
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const [isShowFormAdd, setIsShowFormAdd] = useState(false);
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState("");
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const fetchDataUsers = async () => {
            const fetchedUsers = await fetchUsers();
            const filterUsers = fetchedUsers.data.message.filter((item) => item.id !== user.id)
            setUsers(filterUsers);
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
        const messagesByChatId = messages.filter((msg) => msg.chat_id === chat.id);
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

        if (!chat) {
            return <div className="p-4 text-gray-500">Không tìm thấy phòng chat.</div>;
        }

        return (
            <div className="w-[25vw] h-[70vh] flex flex-col absolute  bottom-2 right-[75%] rounded-xl shadow-lg bg-white border">
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
                            <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                                {chat.users_data.length < 3
                                    ? chat.users_data.find((item) => item.id !== user.id)?.name
                                    : chat.name}
                            </span>
                            {online && <span className="text-xs text-[var(--light-gray3)]">Đang hoạt động</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--main-purple)] text-xl">
                        <div className="cursor-pointer" onClick={() => { setSelectedChatId(""); setIsShowMessage(false) }}>
                            <FaTimes />
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

    const ComponentChat = ({ chat }) => {

        const notSeenCount = selectedChatId !== chat.id ? messages.filter((msg) => msg.chat_id === chat.id && msg.status === 'not seen').length : 0;
        const online = onlineUsers.some((item) => item != user.id && chat.users_data.some(u => u.id === item));
        return <div
            onClick={() => handleShowMessage(chat.id)}
            className="text-[var(--light-gray3)] cursor-pointer hover:text-white flex justify-between items-center"
        >
            <div className="flex items-center gap-2 ">
                <img
                    loading="lazy"
                    src={chat.users_data.length < 3
                        ? chat.users_data.find((item) => item.id !== user.id)?.avatar
                        : '/user.png'}
                    alt=""
                    className="w-8 h-8 object-cover aspect-square rounded-full"
                />

                <div className="flex flex-col ">
                    <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                        {chat.users_data.length > 2
                            ? chat.name
                            : chat.users_data.find((item) => item.id !== user.id)?.name}
                    </div>
                    {online && <div className="text-[var(--main-green)] text-[10px]">Đang hoạt động</div>}
                </div>
            </div>

            {notSeenCount != 0 && <div className="text-black bg-[var(--main-green)] p-1 rounded-full w-5 h-5 flex justify-center items-center text-sm">{notSeenCount}</div>}
        </div>
    };

    const SearchUser = ({ user_by_name }) => {
        const online = onlineUsers.some((item) => item == user_by_name.id);

        const handleTextMessage = () => {
            const existingPrivateChat = chats.find(chat =>
                chat.users_data.length === 2 &&
                chat.users_data.some(u => u.id === user_by_name.id)
            );

            if (existingPrivateChat) {
                setSearchValue("");
                handleShowMessage(existingPrivateChat.id);
            } else {
                const userChatTo = users.find((item) => item.id === user_by_name.id);
                const handleAddChat = async () => {

                    const chatData = {
                        name: "",
                        users: [...new Set([userChatTo.id, user.id])],  // thêm user.id và loại bỏ trùng lặp
                    };
                    try {
                        message.loading({ content: "Đang tạo đoạn chat...", key: "add" });
                        const addChatResponse = await addChat(chatData);

                        if (addChatResponse && addChatResponse.data.status === 201) {
                            dispatch(setChats([addChatResponse.data.message]));
                            setSearchValue("");
                            message.success({ content: "Tạo đoạn chat thành công!", key: "add", duration: 2 });


                        }
                    } catch (error) {
                        console.error("Error adding chat:", error);
                        message.error({ content: "Tạo đoạn chat thất bại!", key: "add", duration: 2 });
                    }
                };
                handleAddChat();
                console.log("Chưa tồn tại đoạn chat 2 người với user này");


            }

        };

        return <div

            className="text-[var(--light-gray3)] flex items-center gap-2  hover:text-white justify-between"
        >
            <div className="flex gap-2 items-center">
                <div className="relative bg-[var(--light-gray3)] rounded-full">
                    <img loading="lazy"
                        src={user_by_name.avatar}
                        alt=""
                        className="w-8 h-8 object-cover aspect-square rounded-full"
                    />
                    {
                        online && <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                    }

                </div>

                <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis self-left">
                    {user_by_name.name}
                </div>
            </div>
            <div className="cursor-pointer" onClick={() => handleTextMessage()}>
                <IoMdText size={20} />
            </div>

        </div>
    }

    const FormAddChatGroup = () => {
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
                const addChatResponse = await addChat(chatData);

                if (addChatResponse && addChatResponse.data.status === 201) {
                    dispatch(setChats([addChatResponse.data.message]));
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
            {isShowChatList && (<>
                <div className="w-full h-[80vh]  p-2 relative flex flex-col">

                    <div className="flex gap-2 items-center h-10">
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
                        <div className="flex items-center justify-end " onClick={() => dispatch(setIsShowChatList(false))}>
                            <HiMiniArrowRight className="text-[var(--light-gray3)] cursor-pointer" size={25} />
                        </div>
                    </div >

                    {
                        searchValue !== "" ? (
                            <div className="flex flex-col gap-2 py-4 pr-2 h-[70vh]  overflow-y-auto custom-scroll">
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
                            <div className=" flex flex-col gap-2 py-4 pr-2  flex-1">
                                {chats?.map((chat, index) => (
                                    <div key={index}>
                                        <ComponentChat chat={chat} />
                                        {isShowMessage && selectedChatId === chat.id && <ChatWindow chat={chat} />}
                                    </div>
                                ))}
                            </div>
                        )
                    }

                </div >
                {isShowFormAdd && <FormAddChatGroup />}
            </>)}
        </>
    );
};

export default ChatList;
