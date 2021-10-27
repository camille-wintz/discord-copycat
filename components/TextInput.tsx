import React, { useEffect, useMemo, useRef } from "react";
import { useParser } from "./useParser";
import styles from "./TextInput.module.scss";
import { useEditable } from "./useEditable";
import { useMentions } from "./useMentions";

export const TextInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const parser = useParser();
  const { getCaretIndex, setCaretIndex, insertMention, editable, currentWord } =
    useEditable(value);
  const {
    show: showMentions,
    data: mentions,
    watchTrigger: triggerMentions,
  } = useMentions<{
    username: string;
  }>("@", "users", editable);
  const {
    show: showChannels,
    data: channels,
    watchTrigger: triggerChans,
  } = useMentions<{ name: string }>("#", "channels", editable);

  const filteredMentions = mentions?.filter((m) =>
    m.username
      .toLowerCase()
      .startsWith(currentWord.toLowerCase().replace("@", ""))
  );
  const filteredChannels = channels?.filter((m) =>
    m.name.toLowerCase().startsWith(currentWord.toLowerCase().replace("#", ""))
  );

  const keyupCb = (e: KeyboardEvent) => {
    const divElement = editable.current as HTMLDivElement;

    if (!divElement || divElement.innerHTML === parser.render(value)) {
      return;
    }

    console.log(document.getSelection()?.getRangeAt(0));

    triggerMentions(e);
    triggerChans(e);

    const pos = getCaretIndex();
    document.getSelection()?.removeAllRanges();
    onChange(divElement.textContent || "");
    divElement.innerHTML =
      parser.render(divElement.textContent || "") || "&#8203;";
    setTimeout(() => setCaretIndex(pos || 0), 0);
  };

  useEffect(() => {
    editable.current?.addEventListener("keyup", keyupCb as EventListener);
    return () =>
      editable.current?.removeEventListener("keyup", keyupCb as EventListener);
  }, [editable.current]);

  useEffect(() => {
    if (editable.current) {
      const divElement = editable.current as HTMLDivElement;
      divElement.innerHTML = parser.render(value) || "&#8203;";
    }
  }, [value]);

  return (
    <div>
      {filteredMentions ? (
        <div
          className={
            styles.options + " " + (showMentions ? styles.visible : "")
          }
        >
          {filteredMentions.map((el) => (
            <div
              className={styles.user}
              onMouseDown={() =>
                onChange(insertMention(value, "@" + el.username))
              }
            >
              <img src="/avatar.png" />
              <span>{el.username}</span>
            </div>
          ))}
        </div>
      ) : null}
      {filteredChannels ? (
        <div
          className={
            styles.options + " " + (showChannels ? styles.visible : "")
          }
        >
          {filteredChannels.map((el) => (
            <div
              className={styles.chan}
              onMouseDown={() => onChange(insertMention(value, "#" + el.name))}
            >
              <img src="/hash.svg" />
              <span>{el.name}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={styles.input}
        contentEditable
        ref={(r) => (editable.current = r)}
      ></div>
    </div>
  );
};
