import { useEffect, useMemo, useRef } from "react";
import { Parser } from "simple-text-parser";

export const Renderer = ({ value }: { value: string }) => {
  const parser = useMemo(() => {
    const p = new Parser();
    p.addRule(/\#[\S]+/gi, function (tag) {
      return `<span class="chan">${tag}</span>`;
    });
    p.addRule(/\@[\S]+/gi, function (tag) {
      return `<span class="mention">${tag}</span>`;
    });
    p.addRule(/\*\*(.*?)\*\*/gm, function (tag) {
      return `<strong>${tag}</strong>`;
    });
    return p;
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: parser.render(value) }}></div>;
};
