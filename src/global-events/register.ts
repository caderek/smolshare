import { addFiles } from "../actions/files";

const preventDefaults = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  document.addEventListener(eventName, preventDefaults, false);
});

document.addEventListener("drop", async (e) => {
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    addFiles(e.dataTransfer.files);
  }
});
