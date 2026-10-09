import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

// Monaco (VS Code's editor, as in DotNetLab), loaded from jsDelivr on first
// use. Shows the runner's diagnostics as squiggles and runs on Ctrl/Cmd+Enter.
// Knows nothing about layout: it fills its parent.

const THEMES = {
  'fp-dark': { base: 'vs-dark', background: '#1a1a19', lineHighlight: '#242422' },
  'fp-light': { base: 'vs', background: '#e2e2df', lineHighlight: '#d8d8d5' },
};

function defineThemes(monaco) {
  for (const [name, { base, background, lineHighlight }] of Object.entries(THEMES)) {
    monaco.editor.defineTheme(name, {
      base,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': background,
        'editor.lineHighlightBackground': lineHighlight,
        'editorGutter.background': background,
      },
    });
  }
}

export default function CodeEditor({ value, onChange, diagnostics = [], onRun, onEditorMount, isDark = true, ariaLabel = 'C# code' }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
    onEditorMount?.(editor);
    applyMarkers();
  };

  const applyMarkers = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel();
    if (!model) return;
    monaco.editor.setModelMarkers(model, 'csharp-runner', diagnostics.map((d) => ({
      startLineNumber: d.line,
      startColumn: d.column,
      endLineNumber: d.endLine ?? d.line,
      // A zero-width span (a missing `;`) still gets a visible squiggle
      endColumn: (d.endLine ?? d.line) === d.line && (d.endColumn ?? d.column) <= d.column ? d.column + 1 : d.endColumn,
      message: `${d.message} (${d.id})`,
      // Exercise rules (FPJ) read as the exercise talking, not the compiler
      source: d.id.startsWith('FPJ') ? 'Exercise' : 'C#',
      severity: d.severity === 'error' ? monaco.MarkerSeverity.Error
        : d.severity === 'warning' ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Info,
    })));
  };

  useEffect(applyMarkers, [diagnostics]);

  return (
    <Editor
      language="csharp"
      value={value}
      onChange={(next) => onChange?.(next ?? '')}
      beforeMount={defineThemes}
      onMount={handleMount}
      theme={isDark ? 'fp-dark' : 'fp-light'}
      loading={<div className="p-4 text-xs opacity-60">Loading editor…</div>}
      options={{
        ariaLabel,
        automaticLayout: true,
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: 13,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'line',
        scrollBeyondLastLine: false,
        tabSize: 4,
        wordWrap: 'on',
      }}
    />
  );
}
