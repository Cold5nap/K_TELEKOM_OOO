import { EquipmentType } from "@/features/equipment-type";

export interface EquipmentForm {
	id?: number;
	equipment_type_id?: number;
	serial_number?: string;
	note?: string | null;
  }
export interface Equipment {
	id: number;
	equipment_type: EquipmentType;
	equipment_type_id: number;
	serial_number: string;
	note?: string | null;
	created_at: string;
	updated_at: string;
  }

  // Параметры запросов
  export interface EquipmentListParams {
	equipment_type?: number;
	page?: number;
	page_size?: number;
	serial_number?: string;
	search?: string;
  }
