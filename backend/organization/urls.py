from django.urls import path, include
from rest_framework.routers import DefaultRouter
 
from .views import RegisterUser, CampaignViewSet, LoginView,PublicCampaignListView, OrgReviewViewSet
 


 
# PublicCampaignListView
 

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'review', OrgReviewViewSet, basename='org_review')
 
urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
 
    path('camp/', include(router.urls)), # Registers all viewsets automatically
    path('view-campaigns/',PublicCampaignListView.as_view(), name='public_campaigns'),
    path('org/auth/login/',LoginView.as_view(), name='login'),
    path('org/auth/register/', RegisterUser.as_view(), name='register_user')
    
    
]
