from django.contrib.auth import login
from django.contrib.auth.views import FormView
from django.urls import reverse
from authtools.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import UserSerializer


class UserView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        user = {
            'first_name': '',
            'last_name': '',
            'email': '',
            'requested': True
        }
        if request.user.is_authenticated:
            user = UserSerializer(instance=request.user, context={'request': request}).data
        return Response(user)


class SignupApiView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')
        response_content = {}
        if not email:
            response_content['email'] = ['This field may not be blank.']
        if not password1:
            response_content['password1'] = ['This field may not be blank.']
        if not password2:
            response_content['password2'] = ['This field may not be blank.']
        if password1 != password2:
            response_content['password2'] = ['Passwords must match.']
        if response_content:
            # if there's any content yet, it's errors
            return Response(response_content, status=HTTP_400_BAD_REQUEST)

        # ========== #
        # CAUTION!!! #
        # ========== #
        if User.objects.filter(email=email):
            response_content['email'] = ['A user with this email already exists.']
            return Response(response_content, status=HTTP_400_BAD_REQUEST)
        else:
            user = User(email=email)
            user.set_password(password1)
            user.save()
            token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                'user': UserSerializer(instance=user, context={'request': request}).data,
                'token': token.key
            },
            status=HTTP_201_CREATED
        )


class SignupView(FormView):
    template_name = 'registration/signup.html'

    def form_valid(self, form):
        email = form.cleaned_data['email']
        new_user = User(email=email)
        new_user.set_password(form.cleaned_data['password1'])
        new_user.backend = 'django.contrib.auth.backends.ModelBackend'
        new_user.save()
        login(self.request, new_user)
        return super().form_valid(form)

    def get_form(self, form_class=None):
        return UserCreationForm(self.request.POST or None)

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs.update({
            'next': self.request.GET.get('next', ''),
        })
        return kwargs

    def get_success_url(self):
        next_url = self.request.POST.get('next')
        if next_url:
            return str(next_url)
        else:
            return reverse('home')
