<script setup>
import {onMounted, ref, watch} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  fetchDefaultViewByListName,
  fetchFilesByFolderId,
  fetchFilesRecursively,
  fetchRootFoldersByListName
} from "./services/sharepointService.js";
import {FilterMatchMode} from "@primevue/core/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";


// Icon imports
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {faFolder, faFolderOpen,} from "@fortawesome/free-regular-svg-icons";
import {createBreadcrumbMenuItems} from "./utils/navigationUtils.js";
import {determineFileIcon} from "./utils/fileUtils.js";
import {formatToLocal} from "./utils/dateUtils.js";

// Configuración de Day.js
dayjs.extend(utc);
dayjs.extend(localizedFormat);

// Variables constantes para configuraciones de SharePoint
const SHAREPOINT_LIST_NAME = "Acreditación";

// Variables reactivas para estado y datos de la aplicación
const defaultViewDetails = ref();
const selectedFolder = ref(null);
const searchFilters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
const isLoading = ref(false);
const rootFolders = ref([]);
const allFiles = ref([]);

/**
 * Initializes search filters.
 */
const initFilters = () => {
  searchFilters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

/**
 * Creates breadcrumb links based on the server relative URL.
 * @param {string} serverRelativeUrl - The server relative URL of the folder.
 * @returns {Array} - The breadcrumb menu items.
 */
const getBreadcrumbLinks = (serverRelativeUrl) => {
  return createBreadcrumbMenuItems(serverRelativeUrl, selectedFolder.value.ServerRelativeUrl, defaultViewDetails.value);
};

onMounted(async () => {
  // Fetch default view details and root folders on component mount
  defaultViewDetails.value = await fetchDefaultViewByListName(SHAREPOINT_LIST_NAME);

  // Fetch root folders and filter those with ItemCount > 0
  const allRootFolders = await fetchRootFoldersByListName(SHAREPOINT_LIST_NAME);
  rootFolders.value = allRootFolders.filter(folder => folder.ItemCount > 0);
});

watch(selectedFolder, async (folder) => {
  if (folder) {
    // Reset filters and loading state
    initFilters();
    allFiles.value = new Array(6);
    isLoading.value = true;

    // Fetch files in the selected folder and any subfolders
    const folderContents = await fetchFilesByFolderId(folder.UniqueId);
    let virtualFiles = [...folderContents.Files.results];

    for (const subfolder of folderContents.Folders.results) {
      const subfolderFiles = await fetchFilesRecursively(subfolder.UniqueId);
      virtualFiles = [...virtualFiles, ...subfolderFiles];
    }

    allFiles.value = virtualFiles; // Update all files state
    isLoading.value = false; // Set loading state to false
  }
});
</script>

<template>
  <div class="container mx-auto">
    <div class="unit-filter">
      <IftaLabel>
        <Select
          id="unit"
          v-model="selectedFolder"
          :options="rootFolders"
          :invalid="!selectedFolder"
          optionLabel="Name"
          fluid
          class="block w-full rounded-md border-0"
        >
          <template #dropdownicon>
            <FontAwesomeIcon :icon="faFolder" />
          </template>
        </Select>
        <label for="unit">Unidad</label>
      </IftaLabel>
    </div>

    <DataTable
      v-model:filters="searchFilters"
      :value="allFiles"
      :loading="isLoading"
      stripedRows
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-end">
          <div class="global-filter h-full w-1/3">
            <IconField>
              <InputIcon>
                <FontAwesomeIcon :icon="faMagnifyingGlass" />
              </InputIcon>
              <InputText
                id="filter"
                type="text"
                v-model="searchFilters['global'].value"
                :disabled="!selectedFolder"
                placeholder="Filtro"
                fluid
                class="block w-full rounded-md border-0 py-8-px"
              ></InputText>
            </IconField>
          </div>
        </div>
      </template>
      <Column field="Name" header="Nombre" sortable>
        <template #body="slotProps">
          <Skeleton v-if="isLoading"></Skeleton>
          <div v-else class="flex items-center mt-4">
            <div class="flex items-center justify-center mr-4">
              <FontAwesomeIcon
                :icon="determineFileIcon(slotProps.data.Name)"
                size="2x"
              />
            </div>
            <div class="flex flex-col">
              <div>
                <a
                  :href="slotProps.data.ServerRelativeUrl"
                  target="_blank"
                  class="my-anchor-style"
                  >{{ slotProps.data.Name }}</a
                >
              </div>
              <div>
                <Breadcrumb
                  :model="getBreadcrumbLinks(slotProps.data.ServerRelativeUrl)"
                  class="my-breadcrumb-style"
                />
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="TimeLastModified"
        header="Modificado"
        dataType="date"
        sortable
      >
        <template #body="slotProps">
          <Skeleton v-if="isLoading"></Skeleton>
          <div v-else>
            {{ formatToLocal(slotProps.data.TimeLastModified, "es", "L") }}
          </div>
        </template>
      </Column>
      <Column field="ModifiedBy.Title" header="Modificado por" sortable>
        <template #body="slotProps">
          <Skeleton v-if="isLoading"></Skeleton>
          <div v-else>
            {{ slotProps.data.ModifiedBy.Title }}
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="h-full flex flex-col items-center justify-center py-16">
          <div class="my-8">
            <FontAwesomeIcon
              :icon="faFolderOpen"
              size="4x"
              class="text-fuchsia-700"
            />
          </div>
          <div class="text-gray-700 font-medium text-lg text-center">
            No hay datos disponibles.
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
@layer tailwind-base, primevue, tailwind-utilities;

@layer tailwind-base {
  @tailwind base;
}

@layer tailwind-utilities {
  @tailwind components;
  @tailwind utilities;
}

.my-breadcrumb-style {
  @apply bg-transparent p-0 m-0 mt-1 text-sm  !important;
  @apply text-surface-700 hover:text-surface-900 focus:text-surface-800 font-medium !important;
  .p-breadcrumb-item-label {
    @apply text-sm !important;
  }
}

.unit-filter {
  @apply mb-4 !important;
}
.global-filter {
  .p-iconfield .p-inputtext:not(:first-child) {
    padding-left: calc(
      (var(--p-form-field-padding-x) * 2) + var(--p-icon-size)
    ) !important;
  }

  .p-inputtext {
    padding: var(--p-inputtext-padding-y) var(--p-inputtext-padding-x) !important;
  }
}

.mr-4 {
  margin-right: 1rem !important;
}

.my-anchor-style {
  @apply text-fuchsia-700 hover:text-fuchsia-900 focus:text-fuchsia-800 !important;
}

.p-togglebutton {
  @apply col-span-12 md:col-span-4 xl:col-span-2  !important;
}
</style>
