# Generated by Django 5.2 on 2025-05-06 05:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0006_campaign_amount_gathered'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to='campaign_images/'),
        ),
    ]
