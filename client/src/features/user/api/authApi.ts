import { useMutation, useQuery } from "vue-query";
import { TokenPair, User, UserTokenResponse } from "../types/userTypes";
import { get, post } from "@/shared/api/commonQueries";
import { LoginForm } from "../types/formTypes";

export function useUserLogin() {
	return useMutation<TokenPair, Error, LoginForm>((credentials) =>
		post<TokenPair, LoginForm>("/api/user/login/", credentials)
	);
}

export function useUserRegister() {
	return useMutation<UserTokenResponse, Error, LoginForm>((userData) =>
		post<UserTokenResponse, LoginForm>("/api/user/register/", userData)
	);
}

export function useUserVerifyToken() {
	return useMutation<void, Error, { token: string }>(({ token }) =>
		post<void, { token: string }>("/api/user/token/verify/", { token })
	);
}

export function useUserRefreshToken() {
	return useMutation<TokenPair, Error, { refresh: string }>(({ refresh }) =>
		post<TokenPair, { refresh: string }>("/api/user/token/refresh/", {
			refresh,
		})
	);
}

export function useUserGetProfile() {
	return useQuery<User, Error>("userProfile", () =>
		get<User>("/api/user/profile/")
	);
}
