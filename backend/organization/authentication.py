from django.contrib.auth.backends import BaseBackend
from organization.models import Organization


# Custom authentication backend for organization using email and password
# This backend allows organizations to authenticate using their contact email and password.
class OrganizationEmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            # Try to find the organization by the contact_email
            user = Organization.objects.get(contact_email=email)
            if user.check_password(password):
                return user
        except Organization.DoesNotExist:
            return None
    
    # This method is used to get the user by their ID.
    # It is typically used by Django's authentication system.
    def get_user(self, user_id):
        try:
            return Organization.objects.get(pk=user_id)
        except Organization.DoesNotExist:
            return None