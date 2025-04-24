import json
import redis.asyncio as aioredis
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from asgiref.sync import sync_to_async

REDIS = aioredis.from_url("redis://3.92.179.198:6379", decode_responses=True)
ONLINE_USERS_KEY = "online_users"

class GlobalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = "global_chat"

        await REDIS.sadd(ONLINE_USERS_KEY, self.user_id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        online_users = await REDIS.smembers(ONLINE_USERS_KEY)
        print("dang hoat dong ",online_users)
        await self.send(text_data=json.dumps({
            'type': 'online_users',
            'users': list(online_users)
        }))

        await self.channel_layer.group_send(self.group_name, {
            'type': 'user_status',
            'user_id': self.user_id,
            'status': 'online'
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await REDIS.srem(ONLINE_USERS_KEY, self.user_id)

        await self.channel_layer.group_send(self.group_name, {
            'type': 'user_status',
            'user_id': self.user_id,
            'status': 'offline'
        })

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('type') == 'message':
            content = data['content']
            chat_id = data['chat_id']
            sender_id = data['sender_id']

            try:
                message_obj = await self.save_message(content, chat_id, sender_id)
            except ValueError as e:
                await self.send(text_data=json.dumps({'type': 'error', 'message': str(e)}))
                return

            await self.channel_layer.group_send(self.group_name, {
                'type': 'chat_message',
                'message': message_obj,
                'status': 'not seen'
            })

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'status': event['status']
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'user_id': event['user_id'],
            'status': event['status']
        }))

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
