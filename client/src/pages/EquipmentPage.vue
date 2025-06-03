<template>
	<q-page padding>
		<div class="row justify-between items-center q-mb-md">
			<h2 class="text-h4">Оборудование</h2>
			<q-btn color="primary" label="Добавить оборудование" @click="addDialog" />
		</div>

		<q-table
			v-model:pagination="pagination"
			@request="onRequest"
			:rows="equipment?.results || []"
			:columns="columns"
			row-key="id"
			:loading="equipmentLoading"
		>
			<template #body-cell-actions="props">
				<q-td :props="props">
					<q-btn
						icon="edit"
						color="primary"
						flat
						dense
						@click="editEquipment(props.row)"
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

		<EquipmentDialog
			v-model:showDialog="showDialog"
			:selectedEquipment="selectedEquipment"
			@close="
				() => {
					showDialog = false;
					selectedEquipment = null;
				}
			"
		/>
	</q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import {
	Equipment,
	useDeleteEquipment,
	useEquipmentList,
	EquipmentDialog,
} from "@/features/equipment";

const columns: QTableColumn[] = [
	{
		name: "equipment_type",
		label: "Тип",
		field: (row: Equipment) => row.equipment_type.name,
		align: "left",
	},
	{
		name: "serial_number",
		label: "Серия",
		field: "serial_number",
		align: "left",
	},
	{ name: "note", label: "Примечание", field: "note", align: "left" },
	{ name: "actions", label: "Действия", field: "", align: "right" },
];


const params = ref({ page: 1, page_size: 10 });
const {
	data: equipment,
	isLoading: equipmentLoading,
	refetch,
} = useEquipmentList(params as any);
const pagination = ref({
	page: 1,
	rowsPerPage: 10,
	rowsNumber: equipment.value?.count,
});
const { mutateAsync: deleteEquipment } = useDeleteEquipment();
const $q = useQuasar();
const selectedEquipment = ref<Partial<Equipment> | null>(null);
const showDialog = ref(false);

watch(equipment, (newData) => {
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
	selectedEquipment.value = { ...selectedEquipment.value, id: undefined };
	showDialog.value = true;
};

const editEquipment = (item: any) => {
	selectedEquipment.value = { ...item };
	showDialog.value = true;
};

const confirmDelete = (id: number) => {
	$q.dialog({
		title: "Подтвердите удаление",
		message: "Вы уверены что хотите удалить оборудование?",
		cancel: true,
		persistent: true,
	}).onOk(async () => {
		await deleteEquipment(id);
	});
};
</script>
