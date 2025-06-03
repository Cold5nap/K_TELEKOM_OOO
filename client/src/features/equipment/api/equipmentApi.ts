import { post } from "@/shared/api/commonQueries";
import {
	usePaginatedList,
	useDetailQuery,
	useCreateMutation,
	useUpdateMutation,
	useDeleteMutation,
} from "@/shared/api/commonQueriesHooks";
import { useQueryClient, useMutation } from "vue-query";
import { EquipmentListParams, Equipment } from "../types/equipmentTypes";
import { Ref } from "vue";

export function useEquipmentList(params?: EquipmentListParams) {
	return usePaginatedList<Equipment, EquipmentListParams>(
		"equipment",
		"/api/equipment/",
		params
	);
}

export function useEquipmentItem(id?: number) {
	return useDetailQuery<Equipment>("equipment", "/api/equipment/", id);
}

export function useCreateEquipment() {
	return useCreateMutation<
		Equipment,
		Omit<Equipment, "id" | "created_at" | "updated_at" | "equipment_type">
	>("equipment", "/api/equipment/");
}

export function useBatchCreateEquipment() {
	const queryClient = useQueryClient();
	return useMutation<
		Equipment[],
		Error,
		Omit<Equipment, "id" | "created_at" | "updated_at" | "equipment_type">[]
	>(
		(data) =>
			post<Equipment[], typeof data>("/api/equipment/batch_create/", data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("equipment");
			},
		}
	);
}

export function useUpdateEquipment() {
	return useUpdateMutation<Equipment, Equipment>(
		"equipment",
		"/api/equipment/"
	);
}

export function useDeleteEquipment() {
	return useDeleteMutation("equipment", "/api/equipment/");
}
