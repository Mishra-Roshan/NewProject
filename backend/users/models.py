from django.db import models


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.username
# Create your models here.
