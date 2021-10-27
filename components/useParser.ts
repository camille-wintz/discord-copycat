import { useMemo } from "react";
import Parser from "simple-text-parser";

export const useParser = () => {
  return useMemo(() => {
    const p = new Parser();
    p.addRule(/\<\#(.*?)\>/gm, function (tag) {
      return `<span class="chan" contenteditable="false"><span class="hidden"><</span>${tag.slice(
        1,
        tag.length - 1
      )}<span class="hidden">></span></span>`;
    });
    p.addRule(/\<\@(.*?)\>/gm, function (tag) {
      return `<span class="mention" contenteditable="false"><span class="hidden"><</span>${tag.slice(
        1,
        tag.length - 1
      )}<span class="hidden">></span></span>`;
    });
    p.addRule(/\*\*(.*?)\*\*/gm, function (tag) {
      return `<strong>${tag}</strong>`;
    });
    return p;
  }, []);
};
