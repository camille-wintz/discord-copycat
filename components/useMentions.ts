import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useMentions = <T>(
  trigger: string,
  dataSource: string,
  element: MutableRefObject<Node | null | undefined>
) => {
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

  const unfocus = () => {
    setTimeout(() => setShow(false));
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
    data,
    watchTrigger,
  };
};
