from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Equipment, EquipmentType
from .serializers import (
    EquipmentSerializer,
    EquipmentTypeSerializer,
    BatchEquipmentSerializer
)


class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EquipmentTypeViewSet(viewsets.ModelViewSet):
    """
    API для работы с типами оборудования.
    Поддерживает пагинацию и фильтрацию по полям name и mask.
    """
    queryset = EquipmentType.objects.all()
    serializer_class = EquipmentTypeSerializer
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'mask']
    permission_classes = [IsAuthenticated]



class EquipmentViewSet(viewsets.ModelViewSet):
    """
    API для работы с оборудованием.
    Поддерживает пагинацию, фильтрацию и мягкое удаление.
    """
    queryset = Equipment.objects.filter(is_deleted=False)
    serializer_class = EquipmentSerializer
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipment_type', 'serial_number']
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        """Мягкое удаление"""
        instance.delete()


class EquipmentBatchViewSet(viewsets.ViewSet):
    """
        Массовое создание оборудования.
    """
    queryset = Equipment.objects.filter(is_deleted=False)
    serializer_class = BatchEquipmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'], url_path='batch-create', url_name='equipment-batch')
    def batch_create(self, request):
        """
        Массовое создание оборудования.
        Принимает массив объектов оборудования.
        Возвращает список созданных объектов и ошибки валидации, если есть.
        """
        serializer = BatchEquipmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        created = []
        errors = []

        for item_data in serializer.validated_data['items']:
            item_serializer = EquipmentSerializer(data=item_data)
            if item_serializer.is_valid():
                equipment = item_serializer.save()
                created.append(EquipmentSerializer(equipment).data)
            else:
                errors.append({
                    'item': item_data,
                    'errors': item_serializer.errors
                })

        response_data = {
            'created': created,
            'errors': errors
        }

        if errors:
            return Response(response_data, status=status.HTTP_207_MULTI_STATUS)
        return Response(response_data, status=status.HTTP_201_CREATED)
