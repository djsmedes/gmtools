from django.db import models


class Campaign(models.Model):
    class Meta:
        abstract = True
