# Generated by Django 2.2b1 on 2019-02-24 05:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_auto_20190222_0134'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='invitation',
            unique_together=set(),
        ),
    ]
