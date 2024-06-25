"use client";
import React, { useState, useTransition } from "react";
import {
  Button,
  Code,
  Paper,
  Tabs,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { LanguageSupport } from "@codemirror/language";
import { runCode } from "../actions";
import { IconCode, IconKeyboard } from "@tabler/icons-react";

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
      setMsg(output || "");
    });
  };

  return (
    <Paper withBorder shadow="md" p={10}>
      <Tabs defaultValue="code">
        <Tabs.List>
          <Tabs.Tab value="code" leftSection={<IconCode />}>
            Code
          </Tabs.Tab>
          <Tabs.Tab value="output" leftSection={<IconKeyboard />}>
            Output
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="code">
          <ReactCodeMirror
            value={code}
            height={rem("400px")}
            width={rem("600px")}
            onChange={(value) => setCode(value)}
            theme={colorscheme === "dark" ? vscodeDark : vscodeLight}
            extensions={languageSupport && [languageSupport]}
          />
          <Button onClick={onClick} disabled={isPending} fullWidth>
            {isPending ? "Running..." : "Run Code"}
          </Button>
        </Tabs.Panel>

        <Tabs.Panel value="output">
          <Code h={rem(435)} w={rem("600px")} block>
            {msg}
          </Code>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}

export default CodeEditor;
