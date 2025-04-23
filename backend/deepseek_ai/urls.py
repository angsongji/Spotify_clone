from django.urls import path
from .views import chat_handler

urlpatterns = [
    path("deepseek/", chat_handler),
]

