"use client";

import Markdown from "react-markdown";
import type { Components } from "react-markdown";

interface QuizMarkdownProps {
  content: string;
}

const components: Components = {
  code({ children, className, node: _node, ...props }) {
    const isBlock = className?.startsWith("language-");

    if (isBlock) {
      return (
        <pre className="my-3 rounded-lg bg-[#0d1117] border border-white/10 overflow-x-auto">
          <code
            className={[
              "block p-4 text-sm font-mono leading-relaxed text-slate-200",
              className ?? "",
            ].join(" ")}
            {...props}
          >
            {children}
          </code>
        </pre>
      );
    }

    return (
      <code
        className="inline-block px-1.5 py-0.5 rounded text-red-600 bg-red-50 border border-red-200 font-mono text-[0.88em]"
        {...props}
      >
        {children}
      </code>
    );
  },
  p({ children, node: _node, ...props }) {
    return (
      <p className="leading-relaxed mb-2 last:mb-0" {...props}>
        {children}
      </p>
    );
  },
  strong({ children, node: _node, ...props }) {
    return (
      <strong className="font-bold text-slate-900" {...props}>
        {children}
      </strong>
    );
  },
  em({ children, node: _node, ...props }) {
    return (
      <em className="italic text-slate-600" {...props}>
        {children}
      </em>
    );
  },
  ul({ children, node: _node, ...props }) {
    return (
      <ul className="list-disc list-inside space-y-1 my-2" {...props}>
        {children}
      </ul>
    );
  },
  ol({ children, node: _node, ...props }) {
    return (
      <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
        {children}
      </ol>
    );
  },
  li({ children, node: _node, ...props }) {
    return (
      <li className="text-slate-700" {...props}>
        {children}
      </li>
    );
  },
};

export function QuizMarkdown({ content }: QuizMarkdownProps) {
  return (
    <div className="text-slate-800 leading-relaxed">
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
