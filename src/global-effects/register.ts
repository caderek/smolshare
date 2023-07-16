import { createEffect } from "solid-js";
import { state, setState } from "../state";
import hash from "../services/hash";
import config from "../config";
import zip from "../actions/download";

createEffect(() => {
  document.title = `${config.name} - ${state.title}`;
});

createEffect(async () => {
  // @todo Add verification if names and title are max 255 bytes!

  console.time("Encoding time");
  const newHash = await hash.encode(state.title, state.files, state.pass);
  console.timeEnd("Encoding time");

  // console.log(newHash);
  console.log("hash length:", newHash?.length);

  location.hash = newHash ?? "";
  setState("size", location.href.length);

  if (newHash !== null) {
    console.time("Decoding time");
    const { date, title, files } = await hash.decode(newHash, state.pass);
    console.timeEnd("Decoding time");

    console.log({ date, title, files });

    for (const file of files) {
      // console.log(await file.text());
    }
  }
});
