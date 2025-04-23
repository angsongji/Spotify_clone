from django.db import models
from django_mongodb_backend.fields import ArrayField
class Playlist(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=255)
    release_date = models.DateField(auto_now_add=True)
    user_id = models.CharField(max_length=24)
    songs = ArrayField(models.CharField(max_length=24), default=list)  # ObjectId của album
    
    class Meta:
        db_table = "playlists"
        app_label = 'spotify'
        managed = False