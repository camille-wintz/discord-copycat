import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MentionsInput, Mention } from "react-mentions";
import { Renderer } from "./Renderer";
import styles from "./TextInput.module.scss";

export const TextInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const container = useRef<HTMLDivElement | undefined | null>();

  return (
    <div ref={(r) => (container.current = r)}>
      <MentionsInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.mentions}
      >
        <Mention
          trigger="@"
          data={[{ id: "@niph" }]}
          className={styles.mention}
          markup="__id__ "
        />
        <Mention trigger="#" data={[{ id: "#chan" }]} markup="__id__ " />
      </MentionsInput>
      <Renderer value={value} />
    </div>
  );
};
