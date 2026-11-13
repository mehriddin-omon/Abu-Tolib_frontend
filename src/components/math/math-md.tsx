import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

/**
 * Markdown + LaTeX: `$x^2$` — qator ichida, `$$...$$` — alohida qatorda.
 * Server va client komponentlarda ishlaydi.
 */
export function MathMd({
  children,
  className,
  inline = false,
}: {
  children: string | null | undefined;
  className?: string;
  /** Variant/qisqa matn: <p> o'ramasdan */
  inline?: boolean;
}) {
  if (!children) return null;
  // Bir qatorda yozilgan "$$...$$" ham alohida (katta) formula bo'lsin
  const md = children.replace(/^[ \t]*\$\$(.+?)\$\$[ \t]*$/gm, '$$$$\n$1\n$$$$');
  return (
    <div className={cn(inline ? 'math-md-inline' : 'math-md', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
