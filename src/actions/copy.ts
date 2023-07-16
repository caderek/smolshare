import { state } from "../state";

export const copyLinkAll = (done?: () => void) => () => {
  const temp = document.querySelector("#copy") as HTMLInputElement;
  temp.value = location.href;
  temp.select();

  document.execCommand("copy");

  if (done) {
    done();
  }
};

export const copyMarkdownLinkAll = (done?: () => void) => () => {
  const temp = document.querySelector("#copy") as HTMLInputElement;
  temp.value = `[${state.title}](${location.href})`;
  temp.select();

  document.execCommand("copy");

  if (done) {
    done();
  }
};
