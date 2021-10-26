import React, { useEffect, useRef } from "react";
import { useParser } from "./ParseChat";
import styles from "./TextInput.module.scss";

function getCaretIndex(element: Node) {
  let position = 0;
  const selection = document.getSelection();
  if (selection?.rangeCount) {
    const range = document.getSelection()?.getRangeAt(0);

    if (!range) {
      return 0;
    }

    const preCaretRange = range?.cloneRange();
    preCaretRange?.selectNodeContents(element);
    preCaretRange?.setEnd(range.endContainer, range.endOffset);
    position = preCaretRange.toString().length;
  }

  return position;
}

function setCaretIndex(node: Node, pos: number) {
  const selection = document.getSelection();
  const range = document.createRange();

  for (let i = 0; i < node.childNodes.length; i++) {
    if (pos <= (node.childNodes[i].textContent?.length || 0)) {
      const n =
        node.childNodes[i].nodeType === Node.TEXT_NODE
          ? node.childNodes[i]
          : node.childNodes[i].firstChild;

      if (!n) {
        continue;
      }

      range.setStart(n, pos);
      range.setEnd(n, pos);
      break;
    }

    pos -= node.childNodes[i].textContent?.length || 0;
  }
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export const TextInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const parser = useParser();
  const editable = useRef<HTMLDivElement | undefined | null>();
  const area = useRef<HTMLTextAreaElement | undefined | null>();

  useEffect(() => {
    editable.current?.addEventListener("keyup", (e) => {
      if (!editable.current || editable.current?.innerText === value) {
        return;
      }
      const pos = getCaretIndex(editable.current);
      onChange(editable.current?.innerText || "");
      setCaretIndex(editable.current, pos);
    });
  }, [editable.current]);

  useEffect(() => {
    if (editable.current) {
      editable.current.innerHTML = parser.render(value);
    }
  }, [value]);

  return (
    <div>
      <div className={styles.options}>
        {[{ id: "@niph" }].map((el) => (
          <div className={styles.options}>{el.id}</div>
        ))}
      </div>

      <div contentEditable ref={(r) => (editable.current = r)}></div>
    </div>
  );
};
