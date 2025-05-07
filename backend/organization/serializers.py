from rest_framework import serializers
from .models import Organization,Campaign,OrgReview
 


# Serializer for Organization model
# This serializer is used to validate and serialize the Organization data. It includes fields for the organization's name, contact email, password, logo, and description.
class OrganizationRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = ['name', 'contact_email', 'password', 'logo', 'org_description']

    def create(self, validated_data):
        return Organization.objects.create_user(**validated_data)


#saving new password after reset
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    password = serializers.CharField(write_only=True)



# Serializer for Campaign model
# This serializer is used to validate and serialize the Campaign data. It includes fields for the campaign's title, description, goal amount, status, deadline, and category.
class CampaignSerializer(serializers.ModelSerializer):
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    image_url = serializers.SerializerMethodField()
 

   

    class Meta:
        model = Campaign
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'status',
            'deadline',
            'created_at',
            'category',
            'amount_gathered',
            'organization_name',
            'images',
            'image_url',
             
        ]
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        if obj.images:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.images.url)
        return None

    def create(self, validated_data):
        images = validated_data.pop('images', None)
        campaign = Campaign.objects.create(**validated_data)
        if images:
            campaign.images = images
            campaign.save()
        return campaign

     

   
class OrgReviewSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = OrgReview
        fields = ['id', 'organization_name', 'review_text', 'created_at', 'rating']
        read_only_fields = ['id', 'organization_name', 'created_at']

