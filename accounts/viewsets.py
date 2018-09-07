from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN

from .models import User
from .serializers import UserSerializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    model = User
    serializer_class = UserSerializer
    lookup_field = 'uuid'
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        if request.user == self.get_object():
            return super().update(request, *args, **kwargs)
        return Response({'detail': 'Users can only edit themselves.'}, status=HTTP_403_FORBIDDEN)
