import type { Component, ParentComponent } from "solid-js";

import styles from "./App.module.css";
import Bars from "./components/Bars";
import Password from "./components/Password";
import { ShareAll, ShareCurrent } from "./components/Share";
import Files from "./components/Files";
import Preview from "./components/Preview";
import More from "./components/More";

const Container: ParentComponent<{ style: any }> = (props) => {
  return (
    <div class={styles.App} style={props.style}>
      {props.children}
    </div>
  );
};

const App: Component = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <Container
        style={{
          resize: "horizontal",
          overflow: "auto",
          width: "240px",
          height: "fit-content",
          border: "solid 1px #ddd",
          background: "var(--color-alt-2-bg)",
        }}
      >
        <Files />
        <More />
      </Container>
      <Container
        style={{
          resize: "horizontal",
          overflow: "auto",
          width: "680px",
          height: "80vh",
          padding: "0",
          border: "solid 1px #ddd",
          background: "var(--color-alt-bg)",
        }}
      >
        <Preview />
      </Container>
      <Container
        style={{
          resize: "horizontal",
          overflow: "auto",
          padding: "2rem",
          width: "320px",
          height: "100%",
          border: "solid 1px #ddd",
          background: "var(--color-bg)",
        }}
      >
        <Password />
        <ShareAll />
        <ShareCurrent />
        <Bars />
      </Container>
    </div>
  );
};

export default App;
