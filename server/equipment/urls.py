from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentBatchViewSet, EquipmentViewSet, EquipmentTypeViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'equipment-batch', EquipmentBatchViewSet,
                basename='equipment-batch')
router.register(r'equipment-type', EquipmentTypeViewSet,
                basename='equipment-type')
urlpatterns = router.urls
