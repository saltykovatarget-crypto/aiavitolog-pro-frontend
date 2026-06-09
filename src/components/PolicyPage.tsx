import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from './Footer';
import privacyPolicyContent from '@/content/policies/privacy-policy.md?raw';
import cookiesPolicyContent from '@/content/policies/cookies-policy.md?raw';
import publicOfferContent from '@/content/policies/public-offer.md?raw';

export type PolicyType = 'privacy-policy' | 'cookies' | 'offer';

const policyContentMap: Record<PolicyType, string> = {
  'privacy-policy': privacyPolicyContent,
  cookies: cookiesPolicyContent,
  offer: publicOfferContent,
};

interface PolicyPageProps {
  type: PolicyType;
}

export function PolicyPage({ type }: PolicyPageProps) {
  const content = policyContentMap[type];

  return (
    <div className="min-h-screen bg-gradient-dark text-foreground">
      <header className="border-b border-border">
        <div className="container max-w-[1100px] mx-auto px-5 py-6 flex items-center justify-between">
          <a
            href="http://aiavitologpro.ru/"
            className="flex items-center gap-3 text-foreground hover:text-foreground/90 transition"
          >
            <span className="font-semibold">AI Авитолог PRO</span>
          </a>
        </div>
      </header>

      <main className="container max-w-[900px] mx-auto px-5 py-12 sm:py-16">
        <div className="space-y-6 text-base sm:text-lg leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-8 mb-4">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">{children}</strong>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-accent underline underline-offset-4 hover:text-accent/80"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>

      <Footer />
    </div>
  );
}
