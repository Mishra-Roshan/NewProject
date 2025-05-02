from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import RegisterUser, CampaignViewSet, LoginView,PublicCampaignListView
=======
 
from .views import RegisterUser, CampaignViewSet, LoginView,PublicCampaignListView
 
from .views import RegisterUser, CampaignViewSet, LoginView,PublicCampaignListView
 
>>>>>>> 224d91cfc6043859da8f5d8124b3c392eccbe20c
from .views import RegisterUser, CampaignViewSet, LoginView
 
# PublicCampaignListView
<<<<<<< HEAD
=======
 
>>>>>>> 224d91cfc6043859da8f5d8124b3c392eccbe20c

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
 
<<<<<<< HEAD
 
urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('camp/', include(router.urls)),  # Registers all viewsets automatically
    path('view-campaigns/',PublicCampaignListView.as_view(),name='public_campaigns'),
    path('camp/', include(router.urls))  # Registers all viewsets automatically
]

=======
urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
 
    path('camp/', include(router.urls)), # Registers all viewsets automatically
    path('view-campaigns/',PublicCampaignListView.as_view(), name='public_campaigns')
  
    
]
>>>>>>> 224d91cfc6043859da8f5d8124b3c392eccbe20c
