import {
	usePaginatedList,
	useDetailQuery,
	useCreateMutation,
	useUpdateMutation,
	useDeleteMutation,
} from "@/shared/api/commonQueriesHooks";
import {
	EquipmentTypeListParams,
	EquipmentType,
} from "../types/equipmentTypes";

export function useEquipmentTypes(params?: EquipmentTypeListParams) {
	return usePaginatedList<EquipmentType, EquipmentTypeListParams>(
		"equipmentTypes",
		"/api/equipment-type/",
		params
	);
}

export function useEquipmentType(id?: number) {
	return useDetailQuery<EquipmentType>(
		"equipmentType",
		"/api/equipment-type/",
		id
	);
}

export function useCreateEquipmentType() {
	return useCreateMutation<EquipmentType, Omit<EquipmentType, "id">>(
		"equipmentTypes",
		"/api/equipment-type/"
	);
}

export function useUpdateEquipmentType() {
	return useUpdateMutation<EquipmentType, EquipmentType>(
		"equipmentTypes",
		"/api/equipment-type/"
	);
}

export function useDeleteEquipmentType() {
	return useDeleteMutation("equipmentTypes", "/api/equipment-type/");
}
