/**
 * Genera items para breadcrumbs según la URL de SharePoint.
 * @param {string} serverRelativeUrl - URL relativa del archivo o carpeta.
 * @param {string} baseRelativeUrl - URL base de la carpeta seleccionada.
 * @param {object} listViewDetails - Detalles de la vista en SharePoint.
 * @returns {Array} Array de objetos de menú para breadcrumbs.
 */
export const buildBreadcrumbMenuItems = (serverRelativeUrl, baseRelativeUrl, listViewDetails) => {
    const urlPath = serverRelativeUrl.replace(baseRelativeUrl, "").split("/").filter(Boolean);
    urlPath.pop();

    return urlPath.map((folder) => {
        baseRelativeUrl += folder + "/";
        return {
            label: folder,
            url: `${listViewDetails.ServerRelativeUrl}?RootFolder=${encodeURIComponent(baseRelativeUrl)}&View=${encodeURIComponent("{" + listViewDetails.Id.toUpperCase() + "}")}`,
            target: "_blank"
        };
    });
};
