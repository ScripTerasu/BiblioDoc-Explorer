import {createApp} from "vue";
import PrimeVue from "primevue/config";
import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";

import App from "./App.vue";

import Breadcrumb from "primevue/breadcrumb";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import IconField from "primevue/iconfield";
import IftaLabel from "primevue/iftalabel";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Skeleton from "primevue/skeleton";

import {inDesignMode} from "./utils.js";

import "./style.css";


if (!inDesignMode()) {
    const app = createApp(App);

    const BiblioDocPreset = definePreset(Aura, {
        semantic: {
            primary: {
                50: "{fuchsia.50}",
                100: "{fuchsia.100}",
                200: "{fuchsia.200}",
                300: "{fuchsia.300}",
                400: "{fuchsia.400}",
                500: "{fuchsia.500}",
                600: "{fuchsia.600}",
                700: "{fuchsia.700}",
                800: "{fuchsia.800}",
                900: "{fuchsia.900}",
                950: "{fuchsia.950}",
            },
        },
    });

    app.use(PrimeVue, {
        theme: {
            preset: BiblioDocPreset,
            options: {
                darkModeSelector: ".app-dark",
            },
        },
    });

    app.component("Breadcrumb", Breadcrumb);
    app.component("Column", Column);
    app.component("DataTable", DataTable);
    app.component("IconField", IconField);
    app.component("IftaLabel", IftaLabel);
    app.component("InputIcon", InputIcon);
    app.component("InputText", InputText);
    app.component("Select", Select);
    app.component("Skeleton", Skeleton);

    app.mount("#app");
}
