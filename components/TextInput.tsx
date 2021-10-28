import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useParser } from "./useParser";
import styles from "./TextInput.module.scss";
import { useEditable } from "./useEditable";
import { useMentions } from "./useMentions";
import { OptionsPanel } from "./OptionsPanel";

export const TextInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const parser = useParser();
  const { getCaretIndex, setCaretIndex, editable, currentWord } =
    useEditable(value);
  const {
    show: showMentions,
    setShow: setShowMentions,
    data: mentions,
    watchTrigger: triggerMentions,
    insertMention,
  } = useMentions<{
    username: string;
  }>("@", "users", editable);
  const {
    show: showChannels,
    setShow: setShowChannels,
    data: channels,
    watchTrigger: triggerChans,
  } = useMentions<{ name: string }>("#", "channels", editable);

  const keydownCb = (e: KeyboardEvent) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      (e.key === "b" && e.ctrlKey) ||
      (e.key === "i" && e.ctrlKey)
    ) {
      e.preventDefault();
    }
  };

  const keyupCb = useCallback(
    (e: KeyboardEvent) => {
      const divElement = editable.current as HTMLDivElement;

      if (!divElement || divElement.innerHTML === parser.render(value)) {
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        return;
      }

      triggerMentions(e);
      triggerChans(e);

      const pos = getCaretIndex();
      document.getSelection()?.removeAllRanges();
      onChange(divElement.textContent || "");
      divElement.innerHTML =
        parser.render(divElement.textContent || "") || "&#8203;";
      setTimeout(() => setCaretIndex(pos || 0), 0);
    },
    [editable.current, triggerChans, triggerMentions]
  );

  useEffect(() => {
    editable.current?.addEventListener("keyup", keyupCb as EventListener);
    editable.current?.addEventListener("keydown", keydownCb as EventListener);

    return () => {
      editable.current?.removeEventListener("keyup", keyupCb as EventListener);
      editable.current?.removeEventListener(
        "keydown",
        keydownCb as EventListener
      );
    };
  }, [editable.current]);

  useEffect(() => {
    if (editable.current) {
      const divElement = editable.current as HTMLDivElement;
      divElement.innerHTML = parser.render(value) || "&#8203;";
    }
  }, [value]);

  return (
    <div>
      <OptionsPanel<{ username: string }>
        onDismiss={() => setShowMentions(false)}
        show={showMentions}
        options={mentions(currentWord)}
        renderElement={(el) => (
          <>
            <img src="/avatar.png" />
            <span>{el.username}</span>
          </>
        )}
        onSelect={(el) => {
          setShowMentions(false);
          onChange(insertMention(value, "@" + el.username));
        }}
      />

      <OptionsPanel<{ name: string }>
        onDismiss={() => setShowChannels(false)}
        show={showChannels}
        options={channels(currentWord)}
        renderElement={(el) => (
          <>
            <img src="/hash.svg" />
            <span>{el.name}</span>
          </>
        )}
        onSelect={(el) => {
          setShowChannels(false);
          onChange(insertMention(value, "#" + el.name));
        }}
      />

      <div
        className={styles.input}
        contentEditable
        ref={(r) => (editable.current = r)}
      ></div>
    </div>
  );
};
