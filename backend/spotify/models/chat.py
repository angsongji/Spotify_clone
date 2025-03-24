from django.db import models
class Chat(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    user1_id = models.CharField(max_length=24)
    user2_id = models.CharField(max_length=24)
    created_at = models.DateTimeField()
    
    class Meta:
        db_table = "chats"
        app_label = 'spotify'
        managed = False