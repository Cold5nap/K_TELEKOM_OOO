<template>
	<q-dialog v-model="showDialogLocal" @hide="handleClose">
		<q-card style="min-width: 400px">
			<q-card-section>
				<div class="text-h6">{{ dialogTitle }}</div>
			</q-card-section>

			<q-card-section>
				<q-form @submit.prevent="handleSubmit">
					<q-select
						:loading="equipmentTypesLoading"
						v-model="formData.equipment_type_id"
						:options="equipmentTypeOptions"
						label="Тип"
						option-value="id"
						option-label="name"
						emit-value
						map-options
						:rules="[(val) => !!val || 'Field is required']"
					/>

					<q-input
						:error="!!error?.serial_number.at(0)"
						:error-message="error?.serial_number.at(0)"
						v-model="formData.serial_number"
						label="Серия"
						:rules="[(val) => !!val || 'Field is required']"
					/>

					<q-input v-model="formData.note" label="Примечание" type="textarea" />

					<q-card-actions align="right">
						<q-btn flat label="Отменить" @click="handleClose" />
						<q-btn
							type="submit"
							color="primary"
							label="Сохранить"
							:loading="updateLoading || createLoading"
						/>
					</q-card-actions>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCreateEquipment, useUpdateEquipment } from "../api/equipmentApi";
import { useEquipmentTypes } from "@/features/equipment-type";
import { Equipment, EquipmentForm } from "../types/equipmentTypes";
import { useQuasar } from "quasar";
import { AxiosError } from "axios";

const emit = defineEmits(["close"]);

const props = defineProps<{
	selectedEquipment: Partial<Equipment> | null;
	showDialog: boolean;
}>();

const defaultFormData = {
	id: undefined,
	equipment_type_id: undefined,
	serial_number: "",
	note: "",
};

const { mutateAsync: updateEquipment, isLoading: updateLoading } =
	useUpdateEquipment();
const { mutateAsync: createEquipment, isLoading: createLoading } =
	useCreateEquipment();
const { data: equipmentTypes, isLoading: equipmentTypesLoading } =
	useEquipmentTypes();
const $q = useQuasar();

const formData = ref<EquipmentForm>({ ...defaultFormData });
const showDialogLocal = ref(false);
const error = ref({ serial_number: [""] });

const dialogTitle = computed(() =>
	formData.value.id ? "Редактирование оборудования" : "Добавление оборудования"
);

const equipmentTypeOptions = computed(() =>
	equipmentTypes.value?.results.map((item) => ({
		id: item.id,
		name: item.name,
	}))
);

watch(
	() => props.selectedEquipment,
	(newVal) => {
		formData.value = newVal
			? { ...newVal, equipment_type_id: newVal.equipment_type?.id }
			: { ...defaultFormData };
	}
);

watch(
	() => props.showDialog,
	(newVal) => {
		showDialogLocal.value = newVal;
	}
);

const handleClose = () => {
	emit("close");
	formData.value = { ...defaultFormData };
	error.value = { serial_number: [""] };
};

const handleSubmit = async () => {
	const data = {
		equipment_type_id: formData.value.equipment_type_id!,
		serial_number: formData.value.serial_number!,
		note: formData.value.note || null,
	};
	const id = formData.value.id;

	try {
		if (id) {
			await updateEquipment({ ...data, id });
		} else {
			await createEquipment(data);
		}
		handleClose();
	} catch (err: any) {
		error.value = err.data;
	}
};
</script>
