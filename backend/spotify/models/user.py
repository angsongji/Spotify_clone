from django.db import models
from django_mongodb_backend.fields import ArrayField
class User(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    avatar = models.URLField(blank=True)
    role = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)
    liked_albums = ArrayField(models.CharField(max_length=24))
    liked_songs = ArrayField(models.CharField(max_length=24))
    class Meta:
        db_table = "users"
        app_label = 'spotify'
        managed = False
