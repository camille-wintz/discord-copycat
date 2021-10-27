import { useCallback, useEffect, useRef, useState } from "react";

export const useEditable = (value: string) => {
  const [currentWord, setCurrentWord] = useState("");
  const editable = useRef<Node | undefined | null>();

  const getCaretIndex = () => {
    const element = editable.current;
    if (!element) {
      return;
    }

    let position = 0;
    const selection = document.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);

      if (!range) {
        return 0;
      }

      const preCaretRange = range?.cloneRange();
      preCaretRange?.selectNodeContents(element);
      preCaretRange?.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }

    return position;
  };

  const findNode = ({
    pos,
    node,
  }: {
    pos: number;
    node: Node | null;
  }): { node: Node; pos: number } | null => {
    if (!node) {
      return null;
    }

    console.log(node);

    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).getAttribute("contenteditable") === "false" &&
      node.textContent?.length === pos
    ) {
      return {
        node: node.parentNode || node,
        pos:
          Array.prototype.indexOf.call(node.parentNode?.childNodes, node) + 1 ||
          0,
      };
    }

    if (
      node.nodeType === Node.TEXT_NODE &&
      (node.textContent?.length || 0) >= pos
    ) {
      return { node, pos };
    }
    if ((node.textContent?.length || 0) < pos) {
      console.log(pos - (node.textContent?.length || 0));
      return findNode({
        pos: pos - (node.textContent?.length || 0),
        node: node.nextSibling,
      });
    }

    return findNode({
      node: node.firstChild,
      pos: pos,
    });
  };

  const setCaretIndex = (pos: number) => {
    const element = editable.current;
    const selection = document.getSelection();
    const range = document.createRange();

    if (!element || !selection) {
      return;
    }

    const targetRange = findNode({ pos, node: editable.current as Node });
    console.log(targetRange);

    if (!targetRange) {
      return;
    }

    try {
      range.setStart(targetRange.node, targetRange.pos);
      range.setEnd(targetRange.node, targetRange.pos);
    } catch (e) {
      console.log(targetRange);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    setTimeout(() => {
      let pos = getCaretIndex();

      if (pos === undefined) {
        return value;
      }

      let startOfWord = pos;
      while (
        value[startOfWord - 1] !== " " &&
        value[startOfWord - 1] !== "&#8203;" &&
        startOfWord > 0
      ) {
        startOfWord--;
      }

      let endOfWord = pos;
      while (value[endOfWord + 1] !== " " && endOfWord < value.length - 1) {
        endOfWord++;
      }

      setCurrentWord(value.slice(startOfWord, endOfWord));
    }, 2);
  }, [value, editable.current]);

  const insertMention = (value: string, mention: string) => {
    let pos = getCaretIndex();

    if (pos === undefined) {
      return value;
    }

    let startOfWord = pos;
    while (value[startOfWord - 1] !== " " && startOfWord > 0) {
      startOfWord--;
    }

    let endOfWord = pos;
    while (value[endOfWord + 1] !== " " && endOfWord < value.length - 1) {
      endOfWord++;
    }

    return (
      value.slice(0, startOfWord) +
      "<" +
      mention +
      "> " +
      value.slice(endOfWord)
    );
  };

  return {
    editable,
    getCaretIndex,
    setCaretIndex,
    insertMention,
    currentWord,
  };
};
