from django.db import models
from django_mongodb_backend.fields import ArrayField
class Chat(models.Model):
    # Sử dụng ArrayField để lưu danh sách user tham gia chat
    users = ArrayField(models.CharField(max_length=24))  # Danh sách user_id
    name = models.CharField(blank=True, max_length=255)
    class Meta:
        db_table = "chats"
        app_label = 'spotify'
        managed = False