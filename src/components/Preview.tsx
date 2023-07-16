import type { Component } from "solid-js";
import { createSignal, createEffect, Switch, Match } from "solid-js";
import { state, setState } from "../state";

import styles from "./Preview.module.css";

enum Categories {
  IMAGE,
  TEXT,
  CODE,
  VIDEO,
  AUDIO,
  OTHER,
}

const getCategory = (file?: File) => {
  if (!file) {
    return;
  }

  if (file.type.includes("image")) {
    return Categories.IMAGE;
  }

  if (file.type.includes("audio")) {
    return Categories.AUDIO;
  }

  if (file.type.includes("video")) {
    return Categories.VIDEO;
  }

  if (file.type.includes("text")) {
    return Categories.TEXT;
  }

  if (file.type.includes("application")) {
    return Categories.CODE;
  }

  return Categories.OTHER;
};

const Preview: Component = () => {
  const [data, setData] = createSignal("");

  createEffect(async () => {
    if (state.files.length === 0) {
      return;
    }

    const category = getCategory(state.files[state.currentFile]);

    if (
      category === Categories.TEXT ||
      category === Categories.CODE ||
      category === Categories.OTHER
    ) {
      const text = await state.files[state.currentFile].text();
      setData(text);
    } else {
      const url = URL.createObjectURL(state.files[state.currentFile]);
      setData(url);
    }
  });

  return (
    <section class={styles.Preview}>
      <Switch>
        <Match
          when={
            getCategory(state.files[state.currentFile]) === Categories.IMAGE
          }
        >
          <img src={data()} alt="" />
        </Match>
        <Match
          when={
            getCategory(state.files[state.currentFile]) === Categories.AUDIO
          }
        >
          <audio src={data()} controls></audio>
        </Match>
        <Match
          when={
            getCategory(state.files[state.currentFile]) === Categories.VIDEO
          }
        >
          <video src={data()} controls loop></video>
        </Match>
        <Match
          when={getCategory(state.files[state.currentFile]) === Categories.TEXT}
        >
          <pre>{data}</pre>
        </Match>
        <Match
          when={getCategory(state.files[state.currentFile]) === Categories.CODE}
        >
          <pre>{data}</pre>
        </Match>
        <Match
          when={
            getCategory(state.files[state.currentFile]) === Categories.OTHER
          }
        >
          <pre>{data}</pre>
        </Match>
      </Switch>
    </section>
  );
};

export default Preview;
