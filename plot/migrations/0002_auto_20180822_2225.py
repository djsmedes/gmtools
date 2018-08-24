# Generated by Django 2.1 on 2018-08-22 22:25

from django.conf import settings
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('plot', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='player_set',
            field=models.ManyToManyField(blank=True, related_name='campaigns_player_of', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='campaign',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
        ),
    ]