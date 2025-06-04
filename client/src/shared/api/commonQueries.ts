import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from "axios";
import { TokenPair, useAuthStore } from "@/features/user";
import { Notify } from "quasar";
import router from "@/app/router";

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

// Конфигурация API клиента
const apiClient: AxiosInstance = axios.create({
	baseURL: "/",
});

// Middleware для добавления токена авторизации
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
	const authStore = useAuthStore();
	if (authStore.accessToken) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${authStore.accessToken}`;
	}
	return config;
});

// Middleware для обработки ошибок
apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};
		const authStore = useAuthStore();

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { data } = await apiClient.post<TokenPair>(
					"/api/user/token/refresh/",
					{
						refresh: authStore.refreshToken,
					}
				);

				authStore.setTokens(data.access, data.refresh);
				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = `Bearer ${data.access}`;
				return apiClient(originalRequest);
			} catch (refreshError) {
				authStore.logout();
				router.push('/auth')
				return Promise.reject(refreshError);
			}
		}
		if (error.response?.status == 400) {
			Notify.create({
				type: "negative",
				icon: "error",
				message: Object.values(error.response.data).at(0),
			});
		}
		return Promise.reject(error);
	}
);

// Функция-помощник для GET запросов
const get = async <T>(
	url: string,
	params?: Record<string, any>
): Promise<T> => {
	try {
		const response = await apiClient.get<T>(url, { params });
		return response.data;
	} catch (error) {
		throw handleApiError(error as AxiosError<ApiError>);
	}
};

// Функция-помощник для POST запросов
const post = async <T, D = any>(url: string, data?: D): Promise<T> => {
	try {
		const response = await apiClient.post<T>(url, data);
		return response.data;
	} catch (error) {
		throw handleApiError(error as AxiosError<ApiError>);
	}
};

// Функция-помощник для PUT запросов
const put = async <T, D = any>(url: string, data: D): Promise<T> => {
	try {
		const response = await apiClient.put<T>(url, data);
		return response.data;
	} catch (error) {
		throw handleApiError(error as AxiosError<ApiError>);
	}
};

// Функция-помощник для PATCH запросов
const patch = async <T, D = any>(url: string, data: D): Promise<T> => {
	try {
		const response = await apiClient.patch<T>(url, data);
		return response.data;
	} catch (error) {
		throw handleApiError(error as AxiosError<ApiError>);
	}
};

// Функция-помощник для DELETE запросов
const del = async (url: string): Promise<void> => {
	try {
		await apiClient.delete(url);
	} catch (error) {
		throw handleApiError(error as AxiosError<ApiError>);
	}
};

// Обработка ошибок API
const handleApiError = (error: AxiosError<ApiError>): ApiError => {
	if (error.response) {
		return {
			message: error.response.data?.message || error.message,
			status: error.response.status,
			data: error.response.data,
		};
	}
	return {
		message: error.message || "An unknown error occurred",
	};
};

export { apiClient, get, post, put, patch, del, PaginatedResponse, ApiError };
