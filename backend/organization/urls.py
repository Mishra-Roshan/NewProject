from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterUser, CampaignViewSet, LoginView

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('camp/', include(router.urls)),  # Registers all viewsets automatically
]