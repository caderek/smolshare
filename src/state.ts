import { createStore } from "solid-js/store";

type State = {
  title: string;
  pass?: string;
  size: number;
  currentFile: number;
  files: File[];
  theme: "dark" | "light";
};

const defaultState: State = {
  title: "My Share",
  pass: undefined,
  size: 0,
  currentFile: 0,
  files: [
    new File([new Blob(["hello"])], "main.js", {
      type: "application/javascript",
    }),
    new File([new Blob(["<h1>Hello</h1>"])], "index.html", {
      type: "text/html",
    }),
  ],
  theme: "light",
};

const [state, setState] = createStore(defaultState);

export { state, setState };
