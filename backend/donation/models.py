# models.py
from django.db import models
from django.contrib.auth.models import User
from organization.models import Campaign
from django.core.exceptions import ValidationError

class Donation(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donated_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='created')
    transaction_id = models.CharField(max_length=100, null=True, blank=True)

    def clean(self):
        if self.status == 'paid':
            current_amount = self.campaign.amount_gathered
            goal_amount = self.campaign.goal_amount
            
            if current_amount + self.amount > goal_amount:
                raise ValidationError({
                    'amount': f'Campaign goal of {goal_amount} would be exceeded. Only {goal_amount - current_amount} can be donated.'
                })

    def save(self, *args, **kwargs):
        self.clean()
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.status == 'paid':
            self.campaign.amount_gathered += self.amount
            self.campaign.save()

    def __str__(self):
        return f"{self.user.first_name} donated {self.amount} to {self.campaign.title}"
