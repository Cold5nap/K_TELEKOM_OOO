import { apiClient } from "@/shared/api/commonQueries";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { User } from "../types/userTypes";
import { LoginForm } from "../types/formTypes";

export const useAuthStore = defineStore("auth", {
	state: () => {
		const userStr = localStorage.getItem("user");
		const user = userStr ? JSON.parse(userStr) : null;
		return {
			accessToken: localStorage.getItem("accessToken") || null,
			refreshToken: localStorage.getItem("refreshToken") || null,
			user,
		};
	},
	actions: {
		setTokens(access: string, refresh: string) {
			this.accessToken = access;
			this.refreshToken = refresh;
			localStorage.setItem("accessToken", access);
			localStorage.setItem("refreshToken", refresh);
		},
		setUser(user: User) {
			this.user = user;
			localStorage.setItem("user", JSON.stringify(user));
		},
		async login(credentials: LoginForm) {
			try {
				const response = await apiClient.post("/api/user/token/", credentials);
				this.setTokens(response.data.access, response.data.refresh);

				// Получаем данные пользователя
				const userResponse = await apiClient.get("/api/user/profile/");
				this.setUser(userResponse.data);

				return userResponse.data;
			} catch (error) {
				this.logout();
				throw error;
			}
		},
		async register(userData: LoginForm) {
			const response = await apiClient.post("/api/user/register/", userData);
			return response.data;
		},
		logout() {
			this.accessToken = null;
			this.refreshToken = null;
			this.user = null;
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");

			// const router = useRouter();
			// router.push("/login");
		},
		async updateRefreshToken() {
			if (!this.refreshToken) {
				throw new Error("No refresh token available");
			}

			const response = await apiClient.post("/api/user/token/refresh/", {
				refresh: this.refreshToken,
			});

			this.setTokens(response.data.access, response.data.refresh);
			return response.data;
		},
	},
	getters: {
		isAuthenticated: (state) => !!state.accessToken,
	},
});
