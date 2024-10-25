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
import 'dayjs/locale/es';

// Icon imports
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {
  faFile,
  faFileAlt,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
  faFolder,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";
import {buildBreadcrumbMenuItems} from "./utils/navigationUtils.js";

// Configuración de Day.js
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// Variables constantes para configuraciones de SharePoint
const SHAREPOINT_LIST_NAME = "Acreditación";

// Variables reactivas para estado y datos de la aplicación
const listViewDetails = ref(null);
const selectedFolder = ref(null);
const searchFilters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
const isLoading = ref(false);
const rootFolders = ref([]);
const allFiles = ref([]);

const initFilters = () => {
  searchFilters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

const formatToLocal = (dateStr, template) => {
  const date = dayjs(dateStr);
  if (date.isValid()) {
    return date.format(template);
  } else {
    return dateStr;
  }
};

const formatMenuItem = (serverRelativeUrl) => {
  let baseRelativeUrl = selectedFolder.value.ServerRelativeUrl;
  const viewDetails = listViewDetails.value;

  // Remove base relative URL to get only the remaining path
  const url = serverRelativeUrl.replace(baseRelativeUrl, "");
  const parts = url.split("/").filter((part) => part);
  parts.pop();

  const menuItems = [];
  parts.forEach((folder) => {
    // Ensure there's always a trailing slash in baseRelativeUrl
    if (!baseRelativeUrl.endsWith("/")) {
      baseRelativeUrl += "/";
    }

    baseRelativeUrl += folder + "/";
    menuItems.push({
      label: folder,
      url: `${viewDetails.ServerRelativeUrl}?RootFolder=${encodeURIComponent(
        baseRelativeUrl
      )}&FolderCTID=${FOLDER_CTID}&View=${encodeURIComponent(
        "{" + viewDetails.Id.toUpperCase() + "}"
      )}`,
      target: "_blank",
    });
  });

  return menuItems;
};

const getIconByFilename = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return faFilePdf;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return faFileImage;
    case "doc":
    case "docx":
      return faFileWord;
    case "xls":
    case "xlsx":
      return faFileExcel;
    case "ppt":
    case "pptx":
      return faFilePowerpoint;
    case "txt":
      return faFileAlt;
    default:
      return faFile;
  }
};

onMounted(async () => {
  listViewDetails.value = await fetchDefaultViewByListName(SHAREPOINT_LIST_NAME);
  rootFolders.value = await fetchRootFoldersByListName(SHAREPOINT_LIST_NAME);
});

watch(selectedFolder, async (unit) => {
  if (unit) {
    initFilters();
    allFiles.value = new Array(6);
    isLoading.value = true;
    console.log("unit: ", unit);
    const rootFolder = await fetchFilesByFolderId(unit.UniqueId);

    console.log("rootFolder Folders: ", rootFolder.Folders);
    console.log("rootFolder Files: ", rootFolder.Files);

    let _virtualFiles = [];
    _virtualFiles.concat(rootFolder.Files.results);

    for (const folder of rootFolder.Folders.results) {
      // files.value = _virtualFiles
      console.log("folder: ", folder);

      const folderFiles = await fetchFilesRecursively(folder.UniqueId);
      _virtualFiles = _virtualFiles.concat(folderFiles);
    }

    allFiles.value = _virtualFiles;

    isLoading.value = false;
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
          variant="filled"
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
                :icon="getIconByFilename(slotProps.data.Name)"
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
                  :model="formatMenuItem(slotProps.data.ServerRelativeUrl)"
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
            {{ formatToLocal(slotProps.data.TimeLastModified, "L") }}
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
