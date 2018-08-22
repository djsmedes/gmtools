from uuid import uuid4
from django.db import models

from .managers import TenantModelManager


class TenantModel(models.Model):
    class Meta:
        abstract = True

    record_owner = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_owned_set",
        editable=False
    )
    uuid = models.UUIDField(
        db_index=True,
        default=uuid4,
        unique=True,
        editable=False
    )
    objects = TenantModelManager()
