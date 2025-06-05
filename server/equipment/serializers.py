from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import Equipment, EquipmentType


class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = ['id', 'name', 'mask']

    def validate(self, data):
        """Валидация маски"""
        equipment = EquipmentType(**data)
        equipment.clean()
        return data


class EquipmentSerializer(serializers.ModelSerializer):
    equipment_type = EquipmentTypeSerializer(read_only=True)
    equipment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all(),
        source='equipment_type',
        write_only=True
    )
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Equipment
        fields = [
            'id', 'equipment_type', 'equipment_type_id',
            'serial_number', 'note', 'created_at', 'updated_at'
        ]

    def validate(self, data):
        """Валидация серийного номера"""
        equipment = Equipment(**data)
        equipment.clean()
        return data


class BatchEquipmentSerializer(serializers.Serializer):
    items = EquipmentSerializer(
        many=True,
        help_text="Список оборудования для пакетного добавления",
        required=True
    )

    class Meta:
        ref_name = "BatchEquipment"

    def validate(self, data):
        errors = []
        valid_data = {}

        # Валидация каждого элемента через EquipmentSerializer
        for item_data in data['items']:
            try:
                item_data['equipment_type_id'] = item_data['equipment_type'].id
                # Создаем временный serializer для валидации
                serializer = EquipmentSerializer(data=item_data)

                serializer.is_valid(raise_exception=True)
                serial_number = item_data.get('serial_number')
                if valid_data.get(serial_number):
                    raise serializers.ValidationError('Повторяющаяся запись')
                else:
                    valid_data.update(
                        {serial_number: serializer.validated_data})
            except serializers.ValidationError as e:
                errors.append({
                    'errors': e.detail,
                    'item': item_data
                })

        if errors:
            raise serializers.ValidationError({
                'message': "Некоторые элементы содержат ошибки",
                'errors': errors,
                'valid_items': valid_data
            })

        return data
