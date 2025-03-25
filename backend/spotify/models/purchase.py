from django.db import models
class Purchase(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    user_id = models.CharField(max_length=24)
    song_id = models.CharField(max_length=24)
    purchase_date = models.DateField()
    
    class Meta:
        db_table = "purchases"
        app_label = 'spotify'
        managed = False