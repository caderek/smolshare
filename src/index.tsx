import { render } from "solid-js/web";

import "./index.css";

import "./global-events/register";
import "./global-effects/register";

import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
