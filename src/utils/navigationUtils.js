/**
 * Genera items para breadcrumbs según la URL de SharePoint.
 * @param {string} fileUrl - URL relativa del archivo o carpeta.
 * @param {string} baseRelativeUrl - URL base de la carpeta seleccionada.
 * @param {object} listViewDetails - Detalles de la vista en SharePoint.
 * @returns {Array} Array de objetos de menú para breadcrumbs.
 */
export const createBreadcrumbMenuItems = (fileUrl, baseRelativeUrl, listViewDetails) => {
    try {
        const urlPath = fileUrl.replace(baseRelativeUrl, "").split("/").filter(Boolean);
        urlPath.pop();

        const baseUrl = listViewDetails.ServerRelativeUrl;
        const encodedView = encodeURIComponent("{" + listViewDetails.Id.toUpperCase() + "}");
        return urlPath.map((folder) => {
            // Asegúrate de que baseRelativeUrl termine en "/"
            if (!baseRelativeUrl.endsWith('/')) {
                baseRelativeUrl += '/';
            }

            baseRelativeUrl += folder;

            const encodedRootFolder = encodeURIComponent(baseRelativeUrl);

            return {
                label: folder,
                url: `${baseUrl}?RootFolder=${encodedRootFolder}&View=${encodedView}`,
                target: "_blank"
            };
        });
    } catch (error){
        console.error('Error generating breadcrumb menu items:', error);
        return [];
    }
};
