from uuid import uuid4
from django.db import models
from authtools.models import AbstractEmailUser


class User(AbstractEmailUser):
    uuid = models.UUIDField(db_index=True, default=uuid4, unique=True, editable=False)

    first_name = models.CharField(max_length=31, null=True, blank=True)
    last_name = models.CharField(max_length=31, null=True, blank=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return '{0.name} <{0.email}>'.format(self)

    @property
    def name(self):
        return '{0.first_name} {0.last_name}'.format(self)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name
