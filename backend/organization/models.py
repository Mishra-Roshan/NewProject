# organization/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import FileExtensionValidator
import uuid
import os

class OrganizationManager(BaseUserManager):
    def create_user(self, contact_email, name, password=None, **extra_fields):
        if not contact_email:
            raise ValueError("Organizations must have a contact email")
        email = self.normalize_email(contact_email)
        org = self.model(contact_email=email, name=name, **extra_fields)
        org.set_password(password)
        org.save(using=self._db)
        return org
    
#organization model
class Organization(AbstractBaseUser):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField(unique=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True  )
    org_description = models.TextField(blank=True)
    password = models.CharField(max_length=128)

    USERNAME_FIELD = 'contact_email'
    REQUIRED_FIELDS = ['name','password']

    objects = OrganizationManager()

    def __str__(self):
        return self.name
    

def campaign_image_path(instance, filename):
    ext =  os.path.splitext(filename)[1]
    return f'campaign_images/{uuid.uuid4()}.{ext}'   

#campaign model
class Campaign(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name='campaigns')
    title = models.CharField(max_length=255)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    amount_gathered = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    category = models.CharField(max_length=255, blank=True, null=True)
    images = models.ImageField(
        upload_to=campaign_image_path,
        blank=True, 
        null=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])]
    )


    def save(self, *args, **kwargs):
        if self.pk:  # If updating existing instance
            try:
                old_instance = Campaign.objects.get(pk=self.pk)
                if old_instance.images and self.images != old_instance.images:
                    old_instance.images.delete(save=False)
            except Campaign.DoesNotExist:
                pass
        super().save(*args, **kwargs)
    def __str__(self):
        return self.title

class OrgReview(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='reviews')
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.PositiveSmallIntegerField(default=5)  # Optional: rating from 1 to 5

    def __str__(self):
        return f"Review by {self.organization.name}"

