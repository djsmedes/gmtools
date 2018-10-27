# Generated by Django 2.1.2 on 2018-10-27 21:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_smalluuid.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('combat', '0004_auto_20181020_0215'),
    ]

    operations = [
        migrations.CreateModel(
            name='GMScreenTab',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', django_smalluuid.models.SmallUUIDField(default=django_smalluuid.models.UUIDDefault, editable=False, unique=True)),
                ('title', models.CharField(max_length=31)),
                ('content', models.TextField()),
                ('user', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='combat_gmscreentab_owned_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
