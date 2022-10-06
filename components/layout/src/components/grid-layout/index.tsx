import React from "react";
import ReactDOM from "react-dom";

import { GridLayout } from "./GridLayout";

class GridLayoutElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  protected render() {
    ReactDOM.render(<GridLayout />, this);
  }
}

customElements.define("layout-grid-layout", GridLayoutElement);
