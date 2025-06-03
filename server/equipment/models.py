from django.db.models import Model, ForeignKey, BooleanField, DateTimeField, CharField, TextField, CASCADE, ProtectedError
from django.core.exceptions import ValidationError
import re
from .utils import PATTERN_MAP, has_invalid_characters


class EquipmentType(Model):
    name = CharField(max_length=255, verbose_name="Наименование типа")
    mask = CharField(max_length=255, verbose_name="Маска серийного номера")

    def __str__(self):
        return self.name

    def clean(self):
        print(has_invalid_characters(self.mask))
        if has_invalid_characters(self.mask):
            raise ValidationError(
                {'mask': f"Маска содержит недопустимые символы. Допустимые символы: {', '.join(PATTERN_MAP.keys())}"}
            )

    def delete(self, *args, **kwargs):
        # Проверяем, есть ли связанные Equipment
        if self.equipment_set.filter(is_deleted=False).exists():
            raise ProtectedError(
                "Нельзя удалить тип оборудования, так как существуют связанные записи оборудования",
                self.equipment_set.filter(is_deleted=False)
            )
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = "Тип оборудования"
        verbose_name_plural = "Типы оборудования"


class Equipment(Model):
    equipment_type = ForeignKey(
        EquipmentType, on_delete=CASCADE, verbose_name="Тип оборудования")
    serial_number = CharField(max_length=255, verbose_name="Серийный номер")
    note = TextField(blank=True, null=True, verbose_name="Примечание")
    is_deleted = BooleanField(default=False, verbose_name="Удалено")
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.equipment_type.name} - {self.serial_number}"

    def clean(self):
        error = None

        # Валидация серийного номера по маске
        if not self.validate_serial_number():
            error = "Серийный номер не соответствует маске типа оборудования"

        # Проверка уникальности серийного номера для данного типа
        if Equipment.objects.filter(
            equipment_type=self.equipment_type,
            serial_number=self.serial_number,
            is_deleted=False
        ).exclude(pk=self.pk).exists():
            error = "Оборудование с таким серийным номером уже существует для этого типа"

        if error:
            raise ValidationError({'serial_number': error})

    def validate_serial_number(self):
        if not self.equipment_type or not self.serial_number:
            return False

        mask = self.equipment_type.mask
        serial = self.serial_number

        if len(mask) != len(serial):
            return False

        regex_pattern = []
        for char in mask:
            if char in PATTERN_MAP:
                regex_pattern.append(PATTERN_MAP[char])
            else:
                # Если символ не из спецификации, считаем его литералом
                regex_pattern.append(re.escape(char))

        full_pattern = '^' + ''.join(regex_pattern) + '$'
        return bool(re.match(full_pattern, serial))

    def delete(self, *args, **kwargs):
        """Мягкое удаление"""
        self.is_deleted = True
        self.save()

    class Meta:
        verbose_name = "Оборудование"
        verbose_name_plural = "Оборудование"
