<template>
	<q-form @submit.prevent="handleRegister">
		<q-input
			v-model="registerForm.username"
			label="Имя"
			:rules="[(val) => !!val || 'Field is required']"
		/>

		<q-input
			v-model="registerForm.password"
			label="Пароль"
			type="password"
			:rules="[(val) => !!val || 'Field is required']"
		/>

		<q-btn
			type="submit"
			color="primary"
			label="Зарегистрироваться"
			:loading="isLoading"
			class="full-width q-mt-md"
		/>
	</q-form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useUserRegister } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const { mutateAsync: register, isLoading } = useUserRegister();
const router = useRouter();
const registerForm = ref({
	username: "",
	password: "",
});
const handleRegister = async () => {
	const res = await register(registerForm.value);
	authStore.setTokens(res.access, res.refresh);
	authStore.setUser(res.user);
	router.push("/equipment");
};
</script>
