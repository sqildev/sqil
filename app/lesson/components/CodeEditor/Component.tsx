"use client";
import React, { useTransition } from "react";
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
import { IconCode, IconKeyboard } from "@tabler/icons-react";
import { runCode } from "../../../actions";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

function CodeEditor(props: NodeViewProps) {
  const { language, code, msg, tab } = props.node.attrs;
  const colorscheme = useComputedColorScheme("dark");
  const languages: Map<string, [number, LanguageSupport]> = new Map([
    ["python", [71, python()]],
    ["javascript", [63, javascript()]],
    ["cpp", [76, cpp()]],
  ]);
  const languageSupport = languages.get(language)?.[1];
  const languageId = languages.get(language)?.[0];

  const [isPending, startTransition] = useTransition();

  const setCode = (value: string) => props.updateAttributes({ code: value });
  const setMsg = (value: string) => props.updateAttributes({ msg: value });
  const setTab = (value: string | null) =>
    props.updateAttributes({ tab: value });

  const onClick = () => {
    startTransition(async () => {
      const output = languageId && (await runCode(languageId, code));
      setMsg(output || "");
      setTab("output");
    });
  };

  return (
    <NodeViewWrapper>
      <Paper withBorder shadow="md" p={10}>
        <Tabs value={tab} onChange={setTab}>
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
              width="100%"
              onChange={(value) => setCode(value)}
              theme={colorscheme === "dark" ? vscodeDark : vscodeLight}
              extensions={languageSupport && [languageSupport]}
            />
            <Button onClick={onClick} disabled={isPending} fullWidth>
              {isPending ? "Running..." : "Run Code"}
            </Button>
          </Tabs.Panel>

          <Tabs.Panel value="output">
            <Code h={rem(435)} w="100%" block>
              {msg}
            </Code>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </NodeViewWrapper>
  );
}

export default CodeEditor;
