<template>
	<q-page class="row items-center justify-center">
		<q-card style="width: 350px; margin-bottom: 200px">
			<q-tabs
				v-model="tab"
				class="text-grey"
				active-color="primary"
				indicator-color="primary"
				align="justify"
				narrow-indicator
			>
				<q-tab name="login" label="Авторизация" />
				<q-tab name="register" label="Регистрация" />
			</q-tabs>
			<q-separator />
			<q-tab-panels v-model="tab" animated>
				<q-tab-panel name="login">
					<LoginForm />
				</q-tab-panel>

				<q-tab-panel name="register">
					<RegisterForm />
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LoginForm, RegisterForm } from "@/features/user";

const tab = ref("login");
</script>
