import { state, setState } from "../state";

export const addFiles = (files: FileList) => {
  setState("files", [...state.files, ...files]);
};

export const removeFile = (file: File) => {
  setState(
    "files",
    state.files.filter((v) => v !== file)
  );
};
