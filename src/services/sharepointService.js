import axios from 'axios';

const sharepointClient = axios.create({
    baseURL: 'https://intranet.ucchristus.cl/sites/BiblioDoc',
    headers: {
        'Accept': 'application/json; odata=verbose',
        'Content-Type': 'application/json; charset=utf-8'
    }
});

/**
 * Retrieves the default view of a SharePoint list by its title.
 * @param {string} listName - The name of the list.
 * @returns {Promise<object>} The default view data.
 * @throws {Error} If the request fails.
 */
export const fetchDefaultViewByListName = async (listName) => {
    try {
        const response = await sharepointClient.get(`/_api/web/lists/getByTitle('${listName}')/DefaultView`);
        return response.data.d;
    } catch (error) {
        console.error(`Error retrieving default view for list '${listName}':`, error);
        throw error;
    }
};

/**
 * Retrieves the root folders of a SharePoint list.
 * @param {string} listName - The name of the list.
 * @returns {Promise<Array>} An array of root folders.
 * @throws {Error} If the request fails.
 */
export const fetchRootFoldersByListName = async (listName) => {
    try {
        const response = await sharepointClient.get(`/_api/web/lists/getByTitle('${listName}')/rootFolder/Folders`);
        return response.data.d.results;
    } catch (error) {
        console.error(`Error retrieving root folders for list '${listName}':`, error);
        throw error;
    }
};

/**
 * Retrieves files in a specific folder by its ID.
 * @param {string} folderId - The ID of the folder.
 * @returns {Promise<object>} The folder data.
 * @throws {Error} If the request fails.
 */
export const fetchFilesByFolderId = async (folderID) => {
    try {
        const response = await sharepointClient.get(`/_api/Web/getFolderById('${folderID}')?$select=*&$expand=Folders,Files,Files/ModifiedBy`);
        return response.data.d;
    } catch (error) {
        console.error(`Error retrieving files from folder with ID '${folderId}':`, error);
        throw error;
    }
};

/**
 * Obtiene archivos de carpetas recursivamente.
 * @param {string} folderId - ID de la carpeta en SharePoint.
 * @returns {Array} Lista de archivos encontrados.
 */
export const fetchFilesRecursively = async (folderId) => {
    try {
        const folderData = await fetchFilesByFolderId(folderId);
        let collectedFiles = folderData.Files.results;

        for (const subFolder of folderData.Folders.results) {
            const subFolderFiles = fetchFilesRecursively(subFolder.UniqueId);
            collectedFiles = collectedFiles.concat(subFolderFiles);
        }

        return collectedFiles;
    } catch (error) {
        console.error(`Error fetching files from folder ID: ${folderId}`, error);
        return [];
    }
};