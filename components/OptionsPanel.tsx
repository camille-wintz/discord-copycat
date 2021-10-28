import { useEffect, useRef, useState } from "react";
import styles from "./OptionsPanel.module.scss";

export function OptionsPanel<T>({
  options,
  renderElement,
  onSelect,
  show,
  onDismiss,
}: {
  options: T[] | undefined;
  renderElement: (el: T) => JSX.Element;
  onSelect: (el: T) => void;
  show: boolean;
  onDismiss: () => void;
}): JSX.Element | null {
  const [selected, setSelected] = useState<T | undefined>();
  const selectedPointer = useRef<T | undefined>();
  const showPointer = useRef<boolean>(show);

  useEffect(() => {
    showPointer.current = show;
  }, [show]);

  useEffect(() => {
    const navigate = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        if (!options || !showPointer.current) {
          return;
        }
        if (!selectedPointer.current) {
          selectedPointer.current = options[options?.length - 1];
        } else {
          const nextIndex = options.indexOf(selectedPointer.current) - 1;
          selectedPointer.current =
            nextIndex >= 0 ? options[nextIndex] : options[options.length - 1];
        }
        setSelected(selectedPointer.current);
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "ArrowDown") {
        if (!options || !showPointer.current) {
          return;
        }

        if (!selectedPointer.current) {
          selectedPointer.current = options[0];
        } else {
          const nextIndex = options.indexOf(selectedPointer.current) + 1;
          selectedPointer.current =
            nextIndex <= options.length - 1 ? options[nextIndex] : options[0];
        }
        setSelected(selectedPointer.current);
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "Enter") {
        if (!selectedPointer.current || !showPointer.current) {
          return;
        }
        onSelect(selectedPointer.current);
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "Escape") {
        if (!showPointer.current) {
          return;
        }

        onDismiss();

        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [options]);

  return options ? (
    <div className={styles.options + " " + (show ? styles.visible : "")}>
      {options.map((el, i) => (
        <div
          key={i}
          className={
            styles.option + " " + (selected === el ? styles.selected : "")
          }
          onMouseDown={() => onSelect(el)}
        >
          {renderElement(el)}
        </div>
      ))}
    </div>
  ) : null;
}
