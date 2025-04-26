import React, { useState } from 'react';
import { Input, Button, List, Spin, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { HiOutlineLightBulb } from "react-icons/hi";
import ReactMarkdown from 'react-markdown';
import { sendMessageAPI } from "../../services/messageService";
import { usePlayerMusic } from "../../context/PlayerMusicContext";
const ChatDeepSeek = () => {
  const { handleClickSong } = usePlayerMusic();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await sendMessageAPI({ message: userInput });

      const data = response.data;
      let aiType = data.type;
      let aiResponse = data.message;
      if (aiType == 'ai') {
        // Xử lý chuỗi nếu nó ở dạng \boxed{ ... }
        const boxedMatch = aiResponse.match(/\\boxed\s*{([\s\S]*)}$/);
        if (boxedMatch) {
          aiResponse = boxedMatch[1].trim();
        }
      } else {
        handleClickSong(data.id);
      }


      setMessages([...newMessages, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Error fetching AI response', error);
      setMessages([
        ...newMessages,
        { text: 'Không thể kết nối đến AI, vui lòng thử lại!', sender: 'ai' },
      ]);
      notification.error({
        message: 'Lỗi kết nối',
        description: 'Không thể kết nối đến AI, vui lòng thử lại sau!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-tl from-stone-900 to-neutral-700 p-6 rounded-base'>
      <div className="group w-fit flex gap-2 items-center mb-2">
        <div className="cursor-pointer text-3xl bg-[var(--light-gray1)] text-[var(--main-green)] p-1 rounded-full">
          <HiOutlineLightBulb />
        </div>
        <div className="text-sm hidden group-hover:block bg-[var(--light-gray2)] px-2 py-1 rounded shadow text-[var(--light-gray3)]">
          Nhập câu lệnh : &lt;Phát bài hát "tên bài hát" của "tên ca sĩ"&gt; để ứng dụng phát nhạc tự động giúp bạn!
        </div>
      </div>

      <List
        className='overflow-y-scroll custom-scroll'
        style={{
          height: '55vh',
          marginBottom: '20px',
        }}
        dataSource={messages.length === 0 ? [{ text: 'Xin chào! Bạn cần hỏi tôi vấn đề gì?', sender: 'ai' }] : messages}
        renderItem={(item) => (
          <List.Item>
            <div
              className={`px-5 py-2 text-[var(--light-gray3)] ${item.sender !== 'user'
                ? '!bg-var(--light-gray1)'
                : '!bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                }`}
              style={{

                borderRadius: '10px',
                maxWidth: '90%',
                marginLeft: item.sender === 'ai' ? '0' : 'auto',
              }}
            >
              {item.sender === 'ai' ? (
                <ReactMarkdown>{item.text}</ReactMarkdown>
              ) : (
                item.text
              )}
            </div>
          </List.Item>
        )
        }
      />

      < form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'center' }}>
        <Input
          value={userInput}
          onChange={handleInputChange}
          placeholder="Nhập câu hỏi hoặc yêu cầu phát nhạc"
          style={{ marginRight: '10px', backgroundColor: 'lightgray', borderColor: 'transparent' }}
        />
        <Button
          htmlType="submit"
          type="primary"
          icon={<SendOutlined />}
          disabled={loading}
          className={`border-0 ${loading
            ? '!bg-gray-500'
            : '!bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
            }`}
        >
          {loading ? <Spin size="small" /> : 'Gửi'}
        </Button>

      </form >
    </div >
  );
};

export default ChatDeepSeek;
