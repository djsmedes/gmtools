from django.http.response import HttpResponseForbidden
from rest_framework.viewsets import ModelViewSet

from .models import User
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    model = User
    serializer_class = UserSerializer
    lookup_field = 'uuid'
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        return HttpResponseForbidden

    def destroy(self, request, *args, **kwargs):
        return HttpResponseForbidden

    def update(self, request, *args, **kwargs):
        if request.user == self.get_object():
            return super().update(request, *args, **kwargs)
        return HttpResponseForbidden
