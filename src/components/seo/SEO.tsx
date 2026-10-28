import { useLocation } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noIndex,
}: SEOProps) {
  const location = useLocation();
  const canonicalPath = path || location.pathname;
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;
  const ogImage = image || `${siteConfig.url}/og-image.svg`;
  const pageTitle = `${title} | ${siteConfig.name}`;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  const jsonLd: {
    "@context": string;
    "@graph": Record<string, unknown>[];
  } = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        ...(siteConfig.email ? { email: siteConfig.email } : {}),
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        ...(siteConfig.address ? { address: siteConfig.address } : {}),
        sameAs: Object.entries(siteConfig.social)
          .filter(([, url]) => Boolean(url))
          .map(([, url]) => String(url)),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageTitle,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
        ],
      },
    ],
  };

  // Only add Article structured data for article pages
  if (type === "article" && publishedTime) {
    (jsonLd["@graph"] as Record<string, unknown>[]).push({
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      url: canonicalUrl,
      headline: title,
      description,
      image: ogImage,
      datePublished: publishedTime,
      ...(modifiedTime ? { dateModified: modifiedTime } : {}),
      ...(authors ? { author: authors.map((a) => ({ "@type": "Person", name: a })) } : {}),
      ...(section ? { articleSection: section } : {}),
      ...(tags ? { keywords: tags } : {}),
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en-IN",
    });
  }

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="language" content="en-IN" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
