import { useMemo } from "react";
import Parser from "simple-text-parser";

export const useParser = () => {
  return useMemo(() => {
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
};
