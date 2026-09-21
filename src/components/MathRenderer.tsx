import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

export const MathText: React.FC<MathRendererProps> = ({ content, className = '', displayMode = false }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Replace $$...$$ first (block math)
    let processed = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        console.warn('KaTeX block error:', err);
        return `<span class="katex-error">${math}</span>`;
      }
    });

    // Replace $...$ (inline math)
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        console.warn('KaTeX inline error:', err);
        return `<span class="katex-error">${math}</span>`;
      }
    });

    return processed;
  }, [content]);

  return (
    <span
      className={`inline-math-container leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

interface ExerciseMediaProps {
  image?: string;
  svg?: string;
  title?: string;
  className?: string;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({ image, svg, title, className = '' }) => {
  if (!image && !svg) return null;

  return (
    <div className={`my-4 flex flex-col items-center justify-center ${className}`}>
      {svg && (
        <div
          className="w-full max-w-md p-3 bg-slate-900/90 rounded-xl border border-slate-700/60 shadow-inner flex items-center justify-center overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      {image && (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700/60 shadow-md bg-slate-900">
          <img
            src={image}
            alt={title || 'Diagrama del ejercicio'}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-64 object-contain mx-auto transition-transform hover:scale-105 duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
