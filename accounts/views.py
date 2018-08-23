from django.contrib.auth import login
from django.contrib.auth.views import FormView
from django.urls import reverse
from authtools.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User


class UserView(APIView):

    def get(self, request, format=None):
        if request.user.is_authenticated:
            content = {
                'repr': str(request.user),
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email
            }
        else:
            content = {
                'detail': 'No logged in user.'
            }
        return Response(content)


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
