from django.db import models
class Message(models.Model):
    # _id = models.CharField(max_length=24, primary_key=True)
    chat_id = models.CharField(max_length=24)
    sender_id = models.CharField(max_length=24)
    content = models.TextField()
    timestamp = models.DateTimeField()
    
    class Meta:
        db_table = "messages"
        app_label = 'spotify'
        managed = False