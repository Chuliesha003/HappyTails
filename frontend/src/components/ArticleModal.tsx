import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import type { Article } from '@/types/api';

interface Props {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Small markdown-ish renderer with support for headings, lists and paragraphs.
// We add utility classes that enable a "drop-cap" effect on the first paragraph
// and use column layout on wider screens to emulate a newspaper feel.
const renderContent = (text?: string) => {
  if (!text) return null;
  const blocks = text.split(/\n\n+/g);
  return blocks.map((blk, i) => {
    const line = blk.trim();
    if (line.startsWith('### ')) {
      return (
        <h4 key={i} className="text-lg font-semibold mt-4 mb-2 font-serif">
          {line.replace(/^###\s+/, '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="text-xl font-bold mt-5 mb-2 font-serif">
          {line.replace(/^##\s+/, '')}
        </h3>
      );
    }
    // simple list detection
    if (line.match(/^[-*]\s+/)) {
      const items = line.split(/\n/).map((l) => l.replace(/^[-*]\s+/, '').trim());
      return (
        <ul key={i} className="list-disc ml-6 mb-3">
          {items.map((it, idx) => (
            <li key={idx} className="mb-1">{it}</li>
          ))}
        </ul>
      );
    }

    // paragraph with drop-cap styling applied to the very first paragraph using
    // Tailwind's first-letter and first-child utilities.
    return (
      <p
        key={i}
        className="leading-relaxed mb-4 text-sm text-muted-foreground first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none font-serif"
      >
        {line}
      </p>
    );
  });
};

const ArticleModal: React.FC<Props> = ({ article, open, onOpenChange }) => {
  const [mainImage, setMainImage] = React.useState<string | undefined>(
    article?.images && article.images.length > 0 ? article.images[0] : article?.imageUrl
  );

  React.useEffect(() => {
    setMainImage(article?.images && article.images.length > 0 ? article.images[0] : article?.imageUrl);
  }, [article]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 md:p-8">
        {article && (
          <div className="space-y-6">
            {/* Newspaper header */}
            <header className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-600">{article.category || 'Feature'}</div>
                  <h1 className="font-serif text-2xl md:text-4xl leading-tight mt-1 mb-2">{article.title}</h1>
                </div>
                <div className="text-right text-xs text-gray-600">
                  <div className="uppercase tracking-wide">By {article.authorName || article.author || 'Staff'}</div>
                  <div className="mt-1">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Recently'}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-0.5 bg-gray-900 w-10 mb-1" />
                <div className="h-px bg-gray-300 w-full" />
              </div>
            </header>

            {/* Lead image and gallery */}
            {mainImage && (
              <div className="w-full">
                <div className="w-full h-64 md:h-80 overflow-hidden rounded-md">
                  <img src={mainImage} alt={article.title} className="w-full h-full object-cover" />
                </div>

                {/* Thumbnails */}
                {article.images && article.images.length > 1 && (
                  <div className="mt-3 flex gap-3 overflow-x-auto">
                    {article.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`flex-shrink-0 rounded-md overflow-hidden border ${mainImage === img ? 'border-gray-900' : 'border-gray-200'}`}
                      >
                        <img src={img} alt={`${article.title} ${idx + 1}`} className="w-28 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Article body: two-column on md and up */}
            <section className="prose prose-lg prose-stone max-w-none md:columns-2 md:gap-8 break-inside-avoid">
              {renderContent(article.content)}
            </section>

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
