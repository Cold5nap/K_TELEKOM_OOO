// Типы для базовых ответов API
type PaginatedResponse<T> = {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
};

type ApiError = {
	message: string;
	status?: number;
	data?: any;
};
