import {
	useQuery,
	useMutation,
	useQueryClient,
	UseQueryOptions,
} from "vue-query";
import { get, post, put, del, PaginatedResponse, patch } from "./commonQueries";

import { Ref, ref, unref } from "vue";

// Общий хук для списков с пагинацией
export function usePaginatedList<T, P extends Record<string, any>>(
	queryKey: string,
	url: string,
	params?: P | Ref<P>,
	options?: UseQueryOptions<PaginatedResponse<T>, Error>
) {
	return useQuery<PaginatedResponse<T>, Error>(
		[queryKey, unref(params)],
		() => get<PaginatedResponse<T>>(url, unref(params)),
		{
			keepPreviousData: true,
			...options,
		}
	);
}

// Общий хук для детальных запросов
export function useDetailQuery<T>(
	queryKey: string,
	url: string,
	id?: number,
	options?: UseQueryOptions<T, Error>
) {
	return useQuery<T, Error>([queryKey, id], () => get<T>(`${url}${id}/`), {
		enabled: !!id,
		...options,
	});
}

// Общий хук для создания
export function useCreateMutation<T, D>(queryKey: string, url: string) {
	const queryClient = useQueryClient();
	return useMutation<T, Error, D>((data) => post<T, D>(url, data), {
		onSuccess: () => {
			queryClient.invalidateQueries(queryKey);
		},
	});
}

// Общий хук для обновления
export function useUpdateMutation<T, D extends { id: number }>(
	queryKey: string,
	url: string
) {
	const queryClient = useQueryClient();
	return useMutation<T, Error, Partial<D>>(
		(data) => patch<T, Partial<Omit<D, "id">>>(`${url}${data.id}/`, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(queryKey);
			},
		}
	);
}

// Общий хук для удаления
export function useDeleteMutation(queryKey: string, url: string) {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>((id) => del(`${url}${id}/`), {
		onSuccess: () => {
			queryClient.invalidateQueries(queryKey);
		},
	});
}
