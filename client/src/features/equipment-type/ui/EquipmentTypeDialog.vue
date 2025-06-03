<template>
	<q-dialog v-model="showDialogLocal" @hide="handleClose">
		<q-card style="min-width: 400px">
			<q-card-section>
				<div class="text-h6">{{ dialogTitle }}</div>
			</q-card-section>

			<q-card-section>
				<q-form @submit.prevent="handleSubmit">
					<q-input
						v-model="formData.name"
						label="Название"
						:rules="[(val) => !!val || 'Поле обязательно']"
						:error="!!error?.name?.at(0)"
						:error-message="error?.name?.at(0)"
					/>

					<q-input
						v-model="formData.mask"
						label="Маска"
						:rules="[(val) => !!val || 'Поле обязательно']"
						:error="!!error?.mask?.at(0)"
						:error-message="error?.mask?.at(0)"
					/>

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
import {
	useCreateEquipmentType,
	useUpdateEquipmentType,
} from "../api/equipmentTypesApi";
import { EquipmentType } from "../types/equipmentTypes";
import { useQuasar } from "quasar";

const emit = defineEmits(["close"]);

const props = defineProps<{
	selectedEquipmentType: Partial<EquipmentType> | null;
	showDialog: boolean;
}>();

const defaultFormData = {
	id: undefined,
	name: "",
	mask: "",
};

const { mutateAsync: updateEquipmentType, isLoading: updateLoading } =
	useUpdateEquipmentType();
const { mutateAsync: createEquipmentType, isLoading: createLoading } =
	useCreateEquipmentType();
const $q = useQuasar();

const formData = ref<Partial<EquipmentType>>({ ...defaultFormData });
const showDialogLocal = ref(false);
const error = ref<Record<string, string[]>>({});

const dialogTitle = computed(() =>
	formData.value.id
		? "Редактирование типа оборудования"
		: "Добавление типа оборудования"
);

watch(
	() => props.selectedEquipmentType,
	(newVal) => {
		formData.value = newVal ? { ...newVal } : { ...defaultFormData };
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
	error.value = {};
};

const handleSubmit = async () => {
	const data = {
		name: formData.value.name!,
		mask: formData.value.mask!,
	};
	const id = formData.value.id;

	try {
		if (id) {
			await updateEquipmentType({ ...data, id });
		} else {
			await createEquipmentType(data);
		}
		handleClose();
	} catch (err: any) {
		error.value = err.response?.data || {};
	}
};
</script>
