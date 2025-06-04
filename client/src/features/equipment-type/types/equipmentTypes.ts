// Типы для оборудования
export interface EquipmentType {
	id: number;
	name: string;
	mask: string;
}
export interface EquipmentTypeListParams {
	mask?: string;
	name?: string;
	page?: number;
	page_size?: number;
	search?:string
}
