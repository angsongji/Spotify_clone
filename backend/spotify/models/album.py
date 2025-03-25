from django.db import models

class Album(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=255)
    artist_id = models.CharField(max_length=24)  # ObjectId của nghệ sĩ
    release_date = models.DateField()
    status = models.IntegerField()
    image = models.URLField()
    
    class Meta:
        db_table = "albums"
        app_label = 'spotify'
        managed = False
