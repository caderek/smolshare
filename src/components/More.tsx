import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { state, setState } from "../state";

import styles from "./More.module.css";

const toggleTheme = (e: MouseEvent) => {
  e.preventDefault();
  setState("theme", state.theme === "light" ? "dark" : "light");
};

const Password: Component = () => {
  const [visible, setVisible] = createSignal(false);

  const togglePasswordVisibility = () => {
    setVisible(!visible());
  };

  return (
    <section class={styles.More}>
      <ul>
        <li>
          <a href="" onClick={toggleTheme}>
            {state.theme === "light" ? "Dark" : "Light"} theme
          </a>
        </li>
        <li>
          <a href="">About</a>
        </li>
        <li>
          <a href="">Github</a>
        </li>
      </ul>
    </section>
  );
};

export default Password;
