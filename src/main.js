import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

import App from './App.vue'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';                   // optional
import Breadcrumb from 'primevue/breadcrumb';
import SelectButton from 'primevue/selectbutton';

import {inDesignMode} from "./utils.js";

import './style.css'
import Card from "primevue/card";
import Skeleton from "primevue/skeleton";
import IftaLabel from "primevue/iftalabel";

if (!inDesignMode()) {
    const app = createApp(App);

    const BiblioDocPreset = definePreset(Aura, {
        semantic: {
            primary: {
                50: '{fuchsia.50}',
                100: '{fuchsia.100}',
                200: '{fuchsia.200}',
                300: '{fuchsia.300}',
                400: '{fuchsia.400}',
                500: '{fuchsia.500}',
                600: '{fuchsia.600}',
                700: '{fuchsia.700}',
                800: '{fuchsia.800}',
                900: '{fuchsia.900}',
                950: '{fuchsia.950}'
            }
        }
    });

    app.use(PrimeVue, {
        theme: {
            preset: BiblioDocPreset,
            options: {
                darkModeSelector: '.app-dark',
            }
        }
    });

    app.component('IftaLabel', IftaLabel);
    app.component('Skeleton', Skeleton);
    app.component('Card', Card);
    app.component('SelectButton', SelectButton);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('Row', Row);
    app.component('DataTable', DataTable);
    app.component('Button', Button);
    app.component('DatePicker', DatePicker);
    app.component('FloatLabel', FloatLabel);
    app.component('IconField', IconField);
    app.component('InputIcon', InputIcon);
    app.component('InputText', InputText);
    app.component('Select', Select);
    app.component('Textarea', Textarea);

    app.mount('#app');
}
