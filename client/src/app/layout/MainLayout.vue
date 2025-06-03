<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>Управление оборудованием</q-toolbar-title>

				<q-space />

				<template v-if="auth.accessToken">
					<q-btn flat label="Оборудование" to="/equipment" />
					<q-btn flat label="Типы оборудования" to="/equipment-types" />
					<q-btn color="red-9" @click="logoutHandle" label="Выйти" />
				</template>
				<template v-else>
					<!-- <q-btn flat label="Login" to="/auth" /> -->
				</template>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<slot></slot>
		</q-page-container>
	</q-layout>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/features/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore()
const logoutHandle = () => {
	auth.logout()
	router.push("/auth");
}
</script>