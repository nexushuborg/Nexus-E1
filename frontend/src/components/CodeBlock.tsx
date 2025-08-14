interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <pre className="rounded-lg p-4 overflow-x-auto bg-muted text-foreground/90">
      <code className="font-mono text-sm leading-relaxed block whitespace-pre">
        {code}
      </code>
    </pre>
  );
};
