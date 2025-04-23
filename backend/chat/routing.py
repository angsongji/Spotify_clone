from django.urls import re_path
from .consumers import *

websocket_urlpatterns = [
    re_path(r'ws/chat/global/(?P<user_id>[0-9a-f]{24})/$', GlobalChatConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_id>[0-9a-f]{24})/(?P<user_id>[0-9a-f]{24})/$', ChatConsumer.as_asgi()),
]
