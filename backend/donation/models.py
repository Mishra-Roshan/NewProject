from django.db import models
from django.contrib.auth.models import User  # Importing the default User model
from organization.models import Campaign  # Assuming you have the Campaign model in the organization app

class Donation(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')  # Now referencing the User model
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if it's a new donation (not an update)
        super().save(*args, **kwargs)
        if is_new:
            # Update the campaign's total gathered amount whenever a new donation is added
            self.campaign.amount_gathered += self.amount
            self.campaign.save()

    def __str__(self):
        return f"{self.user.first_name} donated {self.amount} to {self.campaign.title}"


# Create your models here.
