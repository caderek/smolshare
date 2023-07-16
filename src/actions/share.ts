import { state, setState } from "../state";

export const removeFile = (file: File) => {
  setState(
    "files",
    state.files.filter((v) => v !== file)
  );
};
