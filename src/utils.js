export function inDesignMode() {
    const form = document.forms[window.MSOWebPartPageFormName];
    return !!(window.MSOWebPartPageFormName && (
        (form?.MSOLayout_InDesignMode?.value === "1") ||
        (form?._wikiPageMode?.value === "Edit")
    ));
}
