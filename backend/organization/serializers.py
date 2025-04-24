from rest_framework import serializers
from .models import Organization

class OrganizationRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = ['name', 'contact_email', 'password', 'logo', 'org_description']

    def create(self, validated_data):
        return Organization.objects.create_user(**validated_data)