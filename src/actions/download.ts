import { state } from "../state";

export const downloadAll = async () => {
  if (state.files.length === 0) {
    return;
  }

  const JSZip = (await import("jszip")).default;

  const zip = new JSZip();

  for (const file of state.files) {
    zip.file(file.name, await file.arrayBuffer(), {
      binary: true,
      date: new Date(file.lastModified),
    });
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = state.title;
  a.click();

  URL.revokeObjectURL(url);
};

export const downloadCurrent = async () => {
  const file = state.files[state.currentFile];

  if (!file) {
    return;
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();

  URL.revokeObjectURL(url);
};
