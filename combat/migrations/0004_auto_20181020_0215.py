# Generated by Django 2.1.2 on 2018-10-20 02:15

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('combat', '0003_combatant_encounter'),
    ]

    operations = [
        migrations.AddField(
            model_name='combatant',
            name='initiative_bonus',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='combatant',
            name='player_editors',
            field=models.ManyToManyField(related_name='editable_combatants', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='combatant',
            name='temp_hp',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
