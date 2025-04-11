import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Lấy id phòng chat từ URL
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        print(f"Connecting to room: {self.room_id}")
        self.room_group_name = f"chat_{self.room_id}"

        # Thêm kết nối vào nhóm chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Chấp nhận kết nối WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Xóa kết nối khỏi nhóm chat khi ngắt kết nối
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Xử lý tin nhắn nhận được từ client
        text_data_json = json.loads(text_data)
        print("Tin nhan receive: ", text_data_json)

        message = text_data_json['content']
        chat_id = text_data_json['chat_id']
        sender_id = text_data_json['sender_id']

        # Lưu tin nhắn vào cơ sở dữ liệu
        try:
            message_obj = await self.save_message(message, chat_id, sender_id)
        except ValueError as e:
            await self.send(text_data=json.dumps({'error': str(e)}))
            return
        

        # Gửi tin nhắn đến tất cả những người trong nhóm chat
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_obj  # Trả về content của tin nhắn đã lưu
            }
        )

    async def chat_message(self, event):
        # Nhận tin nhắn từ nhóm chat và gửi lại cho client
        await self.send(text_data=json.dumps(event['message']))

    @sync_to_async
    def save_message(self, content, chat_id, sender_id):
        from spotify.models import Chat, Message
        from spotify.serializers import MessageSerializer
            
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            raise ValueError("Chat room does not exist.")

        if str(sender_id) not in chat.users:
            raise ValueError("User is not a member of this chat room.")

        message_obj = Message.objects.create(
            sender_id=sender_id,
            chat_id=chat_id,
            content=content,
            timestamp=timezone.now()
        )

        return MessageSerializer(message_obj).data