from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import RegisterUser, CampaignViewSet, LoginView,PublicCampaignListView
=======
from .views import RegisterUser, CampaignViewSet, LoginView
# PublicCampaignListView
>>>>>>> 495c41aa7aeeb3afebb5f972c1f35b7ef23d07db

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
print("Running")
urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
<<<<<<< HEAD
    path('camp/', include(router.urls)),  # Registers all viewsets automatically
    path('view-campaigns/',PublicCampaignListView.as_view(),name='public_campaigns')
=======
    path('camp/', include(router.urls))  # Registers all viewsets automatically
    # path('view-campaigns/', PublicCampaignListView.as_view(), name='public_campaigns'),
>>>>>>> 495c41aa7aeeb3afebb5f972c1f35b7ef23d07db
]