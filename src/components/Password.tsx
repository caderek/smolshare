import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { state, setState } from "../state";

import styles from "./Password.module.css";

const Password: Component = () => {
  const [visible, setVisible] = createSignal(false);

  const togglePasswordVisibility = () => {
    setVisible(!visible());
  };

  return (
    <section class={styles.Password}>
      <h2>Encrypt (optional)</h2>
      <fieldset>
        <input
          type={visible() ? "text" : "password"}
          name="password"
          placeholder="password"
          value={state.pass ?? ""}
          onChange={(e) => setState("pass", e.currentTarget.value)}
        />
        <button
          title={visible() ? "Hide" : "Reveal"}
          onClick={togglePasswordVisibility}
        >
          {visible() ? "\uf070" : "\uf06e"}
        </button>
      </fieldset>
    </section>
  );
};

export default Password;
