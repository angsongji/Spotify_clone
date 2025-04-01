from django.db import models
from django.contrib.auth.hashers import make_password, check_password
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
    
    def save(self, *args, **kwargs):
        # Hash password trước khi lưu nếu password thay đổi
        if self._state.adding or self.has_field_changed('password'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def has_field_changed(self, field_name):
        if not self.pk:  # Nếu là object mới
            return True
        
        old_value = User.objects.get(pk=self.pk).__dict__.get(field_name)
        new_value = self.__dict__.get(field_name)
        return old_value != new_value
