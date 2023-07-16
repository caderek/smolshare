import type { Component } from "solid-js";
import { state, setState } from "../state";

import styles from "./Bars.module.css";

const Bars: Component = () => {
  return (
    <section class={styles.Bars}>
      <h2>
        Used space <span>{Number((state.size / 1024).toFixed(2))}kB</span>
      </h2>
      <p>
        The amount of data you can store depends on the browsers you want the
        link to work with.
      </p>
      <ul>
        <li>
          <label>
            All browsers (max 2kB)
            <progress
              class={
                state.size <= 2 ** 11
                  ? styles.great
                  : state.size <= 2 ** 16
                  ? styles.notIdeal
                  : styles.bad
              }
              max={2 ** 11}
              value={state.size}
            />
          </label>
        </li>
        <li>
          <label>
            All modern browsers (max 64kB)
            <progress
              class={state.size <= 2 ** 16 ? styles.ok : styles.bad}
              max={2 ** 16}
              value={state.size}
            />
          </label>
        </li>
      </ul>
    </section>
  );
};

export default Bars;
