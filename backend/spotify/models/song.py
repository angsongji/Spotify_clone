from django.db import models
from django_mongodb_backend.fields import ArrayField

class Song(models.Model):
    name = models.CharField(max_length=255)
    image = models.URLField()
    date = models.DateField()
    duration = models.IntegerField()
    status = models.IntegerField(null=True, default=3)  
    artists = ArrayField(models.CharField(max_length=24)) 
    categories = ArrayField(models.CharField(max_length=24)) 
    file_url = models.URLField()
    price = models.IntegerField(null=True, default=0)  # ✅ Mặc định là 0
    preview_url = models.URLField(blank=True, null=True, default="")  
    album_id = models.CharField(max_length=24, null=True, default="") 
    video_url = models.URLField(blank=True, null=True, default="")

    class Meta:
        db_table = "songs"
        app_label = 'spotify'
        managed = False  # Nếu bạn quản lý DB bằng tay, nếu không hãy bỏ dòng này
