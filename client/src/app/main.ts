import { createApp } from "vue";
import { Dialog, Notify, Quasar } from "quasar";
import quasarLang from "quasar/lang/ru";
import "@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { VueQueryPlugin } from "vue-query";

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(createPinia());
app.use(router);
app.use(Quasar, {
	plugins: { Dialog, Notify }, // import Quasar plugins and add here
	lang: quasarLang,
});

app.mount("#app");
