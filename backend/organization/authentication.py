from django.contrib.auth.backends import BaseBackend
from organization.models import Organization

class OrganizationEmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Try to find the organization by the contact_email
            user = Organization.objects.get(contact_email=username)
            if user.check_password(password):
                return user
        except Organization.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Organization.objects.get(pk=user_id)
        except Organization.DoesNotExist:
            return None