from copy import deepcopy
from django.contrib import admin
from authtools.admin import (
    UserAdmin, BASE_FIELDS, ADVANCED_PERMISSION_FIELDS, DATE_FIELDS,
)
from .models import User


class MyUserAdmin(UserAdmin):
    THIS_BASE_FIELDS = deepcopy(BASE_FIELDS)
    THIS_BASE_FIELDS[1]['fields'] = ('first_name', 'last_name',) + THIS_BASE_FIELDS[1]['fields']
    fieldsets = (
        THIS_BASE_FIELDS,
        ADVANCED_PERMISSION_FIELDS,
        DATE_FIELDS,
    )
    list_display = ('email', 'first_name', 'last_name',)
    list_display_links = ('email', 'first_name', 'last_name',)
    search_fields = ('email', 'first_name', 'last_name',)


admin.site.register(User, MyUserAdmin)
