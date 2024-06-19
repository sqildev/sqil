"use client";
import CodeEditor from "./CodeEditor";
import { NativeSelect } from "@mantine/core";
import React, { useState } from "react";

function EditorTestPage() {
  const [language, setLanguage] = useState("python");

  return (
    <>
      <NativeSelect
        label="Language"
        data={["Python", "JavaScript", "CPP"]}
        value={language}
        onChange={(event) => setLanguage(event.currentTarget.value)}
      />
      <CodeEditor language={language.toLowerCase()} />
    </>
  );
}

export default EditorTestPage;
