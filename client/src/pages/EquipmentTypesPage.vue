<template>
	<q-page padding>
		<div class="row justify-between items-center q-mb-md">
			<h2 class="text-h4">Типы оборудования</h2>
			<q-btn color="primary" label="Добавить тип" @click="addDialog" />
		</div>

		<q-table
			:rows="equipmentTypes?.results || []"
			:columns="columns"
			row-key="id"
			:loading="equipmentTypesLoading"
			v-model:pagination="pagination"
			@request="onRequest"
		>
			<template #body-cell-actions="props">
				<q-td :props="props">
					<q-btn
						icon="edit"
						color="primary"
						flat
						dense
						@click="editEquipmentType(props.row)"
					/>
					<q-btn
						icon="delete"
						color="negative"
						flat
						dense
						@click="confirmDelete(props.row.id)"
					/>
				</q-td>
			</template>
		</q-table>

		<EquipmentTypeDialog
			v-model:showDialog="showDialog"
			:selectedEquipmentType="selectedEquipmentType"
			@close="
				() => {
					showDialog = false;
					selectedEquipmentType = null;
				}
			"
		/>
	</q-page>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import {
	EquipmentType,
	useEquipmentTypes,
	useDeleteEquipmentType,
	EquipmentTypeDialog,
} from "@/features/equipment-type";

const columns: QTableColumn[] = [
	{ name: "name", label: "Название", field: "name", align: "left" },
	{ name: "mask", label: "Маска", field: "mask", align: "left" },
	{ name: "actions", label: "Действия", field: "", align: "right" },
];

const params = ref({ page: 1, page_size: 10 });

const {
	data: equipmentTypes,
	isLoading: equipmentTypesLoading,
	refetch,
} = useEquipmentTypes(params as any);
const pagination = ref({
	page: 1,
	rowsPerPage: 10,
	rowsNumber: equipmentTypes.value?.count,
});
const { mutateAsync: deleteEquipmentType } = useDeleteEquipmentType();
const $q = useQuasar();
const selectedEquipmentType = ref<Partial<EquipmentType> | null>(null);
const showDialog = ref(false);
//пагинация
watch(equipmentTypes, (newData) => {
	console.log(newData?.count);
	if (newData?.count) {
		pagination.value.rowsNumber = newData.count;
	}
	console.log(pagination.value);
});

function onRequest(props: { pagination: typeof pagination.value }) {
	pagination.value = props.pagination;
	params.value = {
		page: props.pagination.page,
		page_size: props.pagination.rowsPerPage || 10,
	};
	console.log(pagination.value);
	refetch.value();
}
const addDialog = () => {
	selectedEquipmentType.value = {
		...selectedEquipmentType.value,
		id: undefined,
	};
	showDialog.value = true;
};

const editEquipmentType = (item: EquipmentType) => {
	selectedEquipmentType.value = { ...item };
	showDialog.value = true;
};

const confirmDelete = (id: number) => {
	$q.dialog({
		title: "Подтвердите удаление",
		message: "Вы уверены что хотите удалить тип оборудования?",
		cancel: true,
		persistent: true,
	}).onOk(async () => {
		await deleteEquipmentType(id);
	});
};
</script>
