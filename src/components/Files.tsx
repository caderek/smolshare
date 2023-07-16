import type { Component } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import { removeFile } from "../actions/files";
import clickOutside from "../directives/clickOutside";
import { state, setState } from "../state";

// assign to a variable to prevent removing as an unused import
const outside = clickOutside;

import styles from "./Files.module.css";

const Share: Component = () => {
  const [optionsActive, setOptionsActive] = createSignal(
    new Array(state.files.length).fill(false)
  );

  const [editActive, setEditActive] = createSignal(
    new Array(state.files.length).fill(false)
  );

  return (
    <section class={styles.Files}>
      <h2>{state.title}</h2>
      <ul>
        <For each={state.files}>
          {(file, index) => (
            <li
              classList={{ [styles.active]: index() === state.currentFile }}
              onClick={() => setState("currentFile", index())}
            >
              <Show
                when={editActive()[index()]}
                fallback={<span>{file.name}</span>}
              >
                <input type="text" name="fileName" value={file.name} />
              </Show>
              <fieldset
                classList={{ [styles.active]: optionsActive()[index()] }}
                // @ts-ignore
                // use:outside={() => {
                //   setOptionsActive(new Array(props.files.length).fill(false));
                // }}
              >
                <button
                  style={{ "--ico": `"\\f142"` }}
                  title="toggle options"
                  onClick={() =>
                    setOptionsActive((prev) => {
                      const temp = [...prev].fill(false);
                      temp[index()] = !prev[index()];
                      return temp;
                    })
                  }
                ></button>
                <button
                  style={{ "--ico": `"\\f304"` }}
                  title="edit"
                  onClick={() =>
                    setEditActive((prev) => {
                      const temp = [...prev].fill(false);
                      temp[index()] = !prev[index()];
                      return temp;
                    })
                  }
                ></button>
                <button
                  style={{ "--ico": `"\\f1f8"` }}
                  title="delete"
                  onClick={() => removeFile(file)}
                ></button>
              </fieldset>
            </li>
          )}
        </For>
      </ul>
      <button>+ Add new file</button>
    </section>
  );
};

export default Share;
