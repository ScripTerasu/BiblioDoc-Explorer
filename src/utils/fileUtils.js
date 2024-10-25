import {
    faFile,
    faFileAlt,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFilePowerpoint,
    faFileWord
} from "@fortawesome/free-regular-svg-icons";

/**
 * Returns the FontAwesome icon associated with a file based on its extension.
 *
 * This utility function takes a filename, extracts its extension, and returns
 * a FontAwesome icon corresponding to the file type. If the extension does not
 * match any specific file type, a generic file icon is returned.
 *
 * Supported extensions and their icons:
 * - PDF: faFilePdf
 * - Image files (jpg, jpeg, png, gif): faFileImage
 * - Word documents (doc, docx): faFileWord
 * - Excel spreadsheets (xls, xlsx): faFileExcel
 * - PowerPoint presentations (ppt, pptx): faFilePowerpoint
 * - Text files (txt): faFileAlt
 * - Other types: faFile (generic file icon)
 *
 * @param {string} fileName - The name of the file (e.g., "document.pdf").
 * @returns {object} - The corresponding FontAwesome icon object.
 */
export const determineFileIcon = (fileName) => {
    // Check if the filename is valid
    if (!fileName || typeof fileName !== 'string') {
        return faFile; // Return generic file icon for invalid input
    }

    const extension = fileName.split(".").pop().toLowerCase();

    switch (extension) {
        case "pdf":
            return faFilePdf;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "svg":
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