import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { useEditorTools } from "./useEditable";

export const useMentions = <T>(
  trigger: string,
  dataSource: string,
  element: MutableRefObject<Node | null | undefined>
) => {
  const { caretIndex, setCaret } = useEditorTools();
  const [data, setData] = useState<T[]>();
  const [show, setShow] = useState(false);

  const watchTrigger = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === trigger) {
        setShow(true);
      }

      if (e.key === " ") {
        setShow(false);
      }

      if (e.key === "Backspace") {
        const selection = document.getSelection();
        const range = selection?.getRangeAt(0);
        if (
          range?.startContainer.textContent &&
          range?.startContainer?.textContent[range.startOffset - 1] === trigger
        ) {
          setShow(false);
        }
      }
    },
    [setShow]
  );

  const insertMention = useCallback((value: string, mention: string) => {
    let pos = caretIndex(element.current as Node);

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

    setTimeout(() => {
      setCaret((pos || 0) + mention.length + 2, element.current as Node);
    }, 50);

    return (
      value.slice(0, startOfWord) +
      "<" +
      mention +
      "> " +
      value.slice(endOfWord)
    );
  }, []);

  const unfocus = () => {
    setTimeout(() => setShow(false), 0);
  };

  useEffect(() => {
    document.addEventListener("click", unfocus);

    (async () => {
      const response = await fetch("/api/links");
      const data = await response.json();
      setData(data[dataSource]);
    })();

    return () => {
      element.current?.removeEventListener(
        "keydown",
        watchTrigger as EventListener
      );
      document.removeEventListener("click", unfocus);
    };
  }, [element.current]);

  return {
    show,
    setShow,
    data: (search: string) => {
      if (!show) {
        return [];
      }
      return data?.filter((el) => {
        let match = false;
        for (let prop in el) {
          match =
            match ||
            (typeof el[prop] === "string" &&
              (el[prop] as any)
                .toLowerCase()
                .startsWith(search.replace(trigger, "").toLowerCase()));
        }
        return match;
      });
    },
    watchTrigger,
    insertMention,
  };
};
