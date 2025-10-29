import React from "react";
import { BLOQUES } from "../data/mockBlocks";
import DocumentEditor from "../components/DocumentEditor";

export default function DocumentEditorPage() {
  return <DocumentEditor bloques={BLOQUES} />;
}
