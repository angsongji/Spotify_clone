"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
import os

# Thiết lập biến môi trường DJANGO_SETTINGS_MODULE
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
import chat.routing 

# Khởi tạo ứng dụng Django
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Xử lý các request HTTP
    "websocket": AuthMiddlewareStack(
        URLRouter(  # Định tuyến cho WebSocket
            chat.routing.websocket_urlpatterns
            # path('ws/chat/<room_id>/', ChatConsumer.as_asgi()),  # Đảm bảo URL khớp
        )
    ),
})
