from django.db import models
from django_mongodb_backend.fields import ArrayField

class Song(models.Model):
    name = models.CharField(max_length=255)
    image = models.URLField(max_length=1000)
    date = models.DateField()
    duration = models.IntegerField()
    status = models.IntegerField(null=True, default=3)  
    artists = ArrayField(models.CharField(max_length=24)) 
    categories = ArrayField(models.CharField(max_length=24)) 
    file_url = models.URLField(max_length=1000)
    price = models.IntegerField(null=True, default=0) 
    album_id = models.CharField(max_length=24, null=True, default="") 
    video_url = models.URLField(blank=True, null=True, default="", max_length=1000)

    class Meta:
        db_table = "songs"
        app_label = 'spotify'
        managed = False  # Nếu bạn quản lý DB bằng tay, nếu không hãy bỏ dòng này
