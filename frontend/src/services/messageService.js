import axiosClient from './axiosClient';

// const chatRealtimeAPI = ()
const sendMessageAPI = (userInput) => {
    return axiosClient.post(`deepseek_api/deepseek/`, userInput, {
        timeout: 60000
    });
};

const sendPromptAPI = (userInput) => {
    return axiosClient.post(`prompt_api/`, userInput, {
        timeout: 60000
    });
};

const addChat = (chatData) => axiosClient.post(`api/add-chat/`, chatData);
const fetchChats = (userId) => axiosClient.get(`api/chats/filter/?userId=${userId}`);
const fetchMessages = (chatId) => axiosClient.get(`api/messages/filter/?chatId=${chatId}`);

export { sendMessageAPI, addChat, fetchChats, fetchMessages, sendPromptAPI };
