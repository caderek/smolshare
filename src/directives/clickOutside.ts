import { onCleanup } from "solid-js";

const getNodeChain = (target: Node) => {
  const nodes = [target];

  let node = target;
  while (node.parentNode) {
    node = node.parentNode;
    nodes.push(node);
  }
  ("return nodes");
};

export default function clickOutside(el: HTMLElement, accessor: any) {
  const onClick = (e: Event) => {
    console.log(e);
    // const nodes = getNodeChain(e.target)
    console.log(el.contains(e.target as Node));
    return !el.contains(e.target as Node) && accessor()?.();
  };

  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
