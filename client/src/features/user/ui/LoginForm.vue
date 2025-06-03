<template>
	<q-form @submit.prevent="handleLogin">
		<q-input
			v-model="loginForm.username"
			label="Имя"
			:rules="[(val) => !!val || 'Field is required']"
		/>

		<q-input
			v-model="loginForm.password"
			label="Пароль"
			type="password"
			:rules="[(val) => !!val || 'Field is required']"
		/>

		<q-btn
			type="submit"
			color="primary"
			label="Авторизоваться"
			:loading="isLoading"
			class="full-width q-mt-md"
		/>
	</q-form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useUserLogin } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { mutateAsync: login, isLoading } = useUserLogin();
const loginForm = ref({
	username: "",
	password: "",
});

const handleLogin = async () => {
	const res = await login(loginForm.value);
	authStore.setTokens(res.access, res.refresh);
	router.push("/equipment");
};
</script>
