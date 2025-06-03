import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/pages/AuthPage.vue";
import EquipmentPage from "@/pages/EquipmentPage.vue";
import EquipmentTypesPage from "@/pages/EquipmentTypesPage.vue";
import { useAuthStore } from "@/features/user";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/equipment",
		},
		{
			path: "/auth",
			name: "auth",
			component: AuthPage,
			meta: { requiresAuth: false },
		},
		{
			path: "/equipment",
			name: "equipment",
			component: EquipmentPage,
			meta: { requiresAuth: true },
		},
		{
			path: "/equipment-types",
			name: "equipment-types",
			component: EquipmentTypesPage,
			meta: { requiresAuth: true },
		},
	],
});

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	if (to.meta.requiresAuth && !authStore.accessToken) {
		next("/auth");
	} else if (to.path === "/auth" && authStore.accessToken) {
		next("/equipment");
	} else {
		next();
	}
});

export default router;
