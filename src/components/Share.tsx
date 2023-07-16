import type { Component } from "solid-js";
import { downloadAll, downloadCurrent } from "../actions/download";
import { copyLinkAll, copyMarkdownLinkAll } from "../actions/copy";

import styles from "./Share.module.css";

// const options = [
//   { name: "Share via...", ico: "\\f1e0" },
// ];

const ShareAll: Component = () => {
  return (
    <section class={styles.Share}>
      <h2>All files</h2>
      <ul>
        <li>
          <button style={{ "--ico": `"\\f0c1"` }} onClick={copyLinkAll()}>
            Copy link
          </button>
          <button
            style={{ "--ico": `"\\f0c1"` }}
            onClick={copyMarkdownLinkAll()}
          >
            Copy link as markdown
          </button>
          <button style={{ "--ico": `"\\f019"` }} onClick={downloadAll}>
            Download
          </button>
        </li>
      </ul>
    </section>
  );
};

const ShareCurrent: Component = () => {
  return (
    <section class={styles.Share}>
      <h2>Current file</h2>
      <ul>
        <li>
          <button style={{ "--ico": `"\\f0c1"` }}>Copy link</button>
          <button style={{ "--ico": `"\\f0c1"` }}>Copy link as markdown</button>
          {/* <button style={{ "--ico": `"\\f0c5"` }}>Copy content</button> */}
          <button style={{ "--ico": `"\\f019"` }} onClick={downloadCurrent}>
            Download
          </button>
        </li>
      </ul>
    </section>
  );
};

export { ShareAll, ShareCurrent };
