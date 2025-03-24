from django.db import models
from django_mongodb_backend.fields import ArrayField
class Song(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=255)
    image = models.URLField()
    date = models.DateField()
    duration = models.IntegerField()
    status = models.IntegerField()
    artists = ArrayField(models.CharField(max_length=24))  # Lưu ObjectId của nghệ sĩ
    categories = ArrayField(models.CharField(max_length=24))  # Lưu ObjectId của thể loại
    file_url = models.URLField()
    price = models.IntegerField()
    preview_url = models.URLField(blank=True, null=True)
    album_id = models.CharField(max_length=24)  # ObjectId của album
    
    class Meta:
        db_table = "songs"
        app_label = 'spotify'
        managed = False