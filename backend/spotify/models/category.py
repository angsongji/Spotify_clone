from django.db import models
class Category(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    
    class Meta:
        db_table = "categories"
        app_label = 'spotify'
        managed = False