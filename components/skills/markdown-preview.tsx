import type { MarkdownBlock } from "@/lib/types";
import { getPanelClassName, Panel } from "@/components/ui/panel";

export function MarkdownPreview({
  blocks,
  title = "Rendered markdown preview",
}: {
  blocks: MarkdownBlock[];
  title?: string;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
          Previewed from the uploaded or stored markdown so you can scan the content quickly.
        </p>
      </div>

      <div className="space-y-5 px-6 py-6">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return block.level === 1 ? (
              <h1 key={index} className="text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                {block.content}
              </h1>
            ) : block.level === 2 ? (
              <h2 key={index} className="text-[var(--font-size-heading-m)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                {block.content}
              </h2>
            ) : (
              <h3 key={index} className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                {block.content}
              </h3>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p key={index} className="break-words text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted-strong">
                {block.content}
              </p>
            );
          }

          if (block.type === "list") {
            return (
              <ul
                key={index}
                className={getPanelClassName({
                  tone: "subtle",
                  padding: "md",
                  className: "space-y-3 shadow-none text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted-strong",
                })}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "quote") {
            return (
              <blockquote
                key={index}
                className={getPanelClassName({
                  tone: "brand-subtle",
                  padding: "md",
                  className: "break-words border-accent/12 shadow-none text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-accent-strong",
                })}
              >
                {block.content}
              </blockquote>
            );
          }

          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-[16px] bg-[#10192a] px-5 py-4 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-slate-100"
            >
              <code className="whitespace-pre-wrap break-words">{block.content}</code>
            </pre>
          );
        })}
      </div>
    </Panel>
  );
}
