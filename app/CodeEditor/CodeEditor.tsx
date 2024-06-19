"use client";
import React, { useState, useTransition } from "react";
import { useComputedColorScheme } from "@mantine/core";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { LanguageSupport } from "@codemirror/language";
import { Button, Code } from "@mantine/core";
import { runCode } from "../actions";

function CodeEditor({ language }: { language: string }) {
  const colorscheme = useComputedColorScheme("dark");
  const languages: Map<string, [number, LanguageSupport]> = new Map([
    ["python", [71, python()]],
    ["javascript", [63, javascript()]],
    ["cpp", [76, cpp()]],
  ]);
  const languageSupport = languages.get(language)?.[1];
  const languageId = languages.get(language)?.[0];

  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const onClick = () => {
    startTransition(async () => {
      const output = languageId && (await runCode(languageId, code));
      setMsg(!output && output !== "" ? "Something went wrong." : output);
    });
  };

  return (
    <>
      <ReactCodeMirror
        value={code}
        onChange={(value) => setCode(value)}
        height="400px"
        width="500px"
        theme={colorscheme === "dark" ? vscodeDark : vscodeLight}
        extensions={languageSupport && [languageSupport]}
      />
      <Button disabled={isPending} onClick={onClick}>
        {isPending ? "Running..." : "Run Code"}
      </Button>
      {!isPending && <Code block>{msg}</Code>}
    </>
  );
}

export default CodeEditor;
