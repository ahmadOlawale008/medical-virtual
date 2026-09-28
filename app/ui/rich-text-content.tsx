"use client";

import DOMPurify from "dompurify";

export default function RichTextContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const sanitized =
    typeof window !== "undefined" && typeof DOMPurify.sanitize === "function"
      ? DOMPurify.sanitize(html)
      : html;

  return (
    <div
      className={`[&_a]:text-primary [&_a]:underline [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

