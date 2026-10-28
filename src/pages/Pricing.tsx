import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Info,
  Receipt,
  Sparkles,
  Star,
  Plus,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import {
  pricingPackages,
  pricingCategories,
  pricingConfig,
  pricingDisclaimer,
  gstExample,
  paymentTerms,
} from "@/data/pricing";
import { serviceList } from "@/data/services";
import { formatINR, formatUSD, cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/* Tiered package IDs referenced by services — these get detailed cards */
const tieredIds = new Set(
  serviceList.flatMap((s) => s.pricing),
);

/* Service categories only (exclude "additional" — addons shown separately) */
const serviceCategories = pricingCategories.filter(
  (c) => c.key !== "additional",
);

/* Pricing FAQs — answers derived from published pricing data, not invented */
const pricingFAQs = [
  {
    question: "Are these prices fixed?",
    answer:
      "No. Prices shown are indicative starting prices. Final pricing depends on project scope, requirements and deliverables. We confirm a fixed quote before work begins.",
  },
  {
    question: "Does the price include GST?",
    answer: `No. Prices exclude GST, where applicable. GST is added based on the applicable tax treatment confirmed before invoicing. For example, a base price of ₹${gstExample.basePrice.toLocaleString("en-IN")} plus GST at ${gstExample.gstRate}% (₹${gstExample.gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}) totals ₹${gstExample.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`,
  },
  {
    question: "Are hosting and domain charges included?",
    answer:
      "No. Hosting, domain renewals and paid subscriptions are additional unless explicitly included in your proposal.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "Revision limits are listed on each package. Where a package does not state a limit, revision rounds are agreed in your proposal before work starts.",
  },
  {
    question: "Can I request custom features or a custom package?",
    answer:
      "Yes. We can prepare a custom proposal based on your requirements. Request a custom quote and we'll define a suitable scope together.",
  },
  {
    question: "How do payment terms work?",
    answer: `Payment terms depend on the project type: ${paymentTerms
      .map((t) => `${t.scope.toLowerCase()} — ${t.terms}`)
      .join("; ")}.`,
  },
  {
    question: "Is advertising spend included in marketing packages?",
    answer:
      "No. Advertising expenditure is separate and paid by the client, in addition to the management fee.",
  },
  {
    question: "Can I combine multiple services?",
    answer:
      "Yes. Many clients combine services such as branding with a website, or design with marketing. We prepare a single, coordinated proposal.",
  },
];

interface PricingCardProps {
  p: (typeof pricingPackages)[number];
  market: "india" | "international";
}

function PricingCard({ p, market }: PricingCardProps) {
  const showPromo =
    p.id === "graphic-promo-5" && !pricingConfig.enableSocialMediaPromotion;
  if (showPromo) return null;

  const priceDisplay =
    p.price === null
      ? "On request"
      : market === "india"
        ? formatINR(p.price)
        : formatUSD(p.price);

  const qualifierText =
    p.priceQualifier === "starting-at"
      ? "Starting at"
      : p.priceQualifier === "on-request"
        ? "On request"
        : "";

  const card = (
    <div
      className={cn(
        "relative h-full flex flex-col rounded-card-lg p-7 md:p-8 transition-all duration-300",
        p.highlighted
          ? "bg-navy text-white shadow-card-hover"
          : "bg-white border border-border-default hover:shadow-card-hover hover:-translate-y-1",
      )}
    >
      {p.highlighted && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          <Star className="w-3 h-3 fill-current" />
          Most Popular
        </span>
      )}
      {p.badge && !p.highlighted && (
        <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 uppercase tracking-wider">
          {p.badge}
        </span>
      )}

      <h3
        className={cn(
          "text-lg font-bold mb-3 pr-16",
          p.highlighted ? "text-white" : "text-text-primary",
        )}
      >
        {p.packageName}
      </h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={cn(
            "text-3xl font-extrabold tracking-tight",
            p.highlighted ? "text-white" : "text-text-primary",
          )}
        >
          {priceDisplay}
        </span>
        {p.billingPeriod === "month" && (
          <span
            className={cn(
              "text-sm",
              p.highlighted ? "text-white/60" : "text-text-muted",
            )}
          >
            /month
          </span>
        )}
      </div>
      {qualifierText && (
        <p
          className={cn(
            "text-xs font-medium mb-4",
            p.highlighted ? "text-primary" : "text-text-muted",
          )}
        >
          {qualifierText}
          {p.billingPeriod === "one-time" && " · One-time"}
        </p>
      )}
      {!qualifierText && p.billingPeriod === "one-time" && (
        <p
          className={cn(
            "text-xs mb-4",
            p.highlighted ? "text-white/50" : "text-text-muted",
          )}
        >
          One-time
        </p>
      )}

      {p.shortDescription && (
        <p
          className={cn(
            "text-sm leading-relaxed mb-5",
            p.highlighted ? "text-white/70" : "text-text-secondary",
          )}
        >
          {p.shortDescription}
        </p>
      )}

      <div
        className={cn(
          "h-px mb-5",
          p.highlighted ? "bg-white/15" : "bg-border-default",
        )}
      />

      <ul className="space-y-2.5 text-sm mb-6">
        {p.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                p.highlighted ? "bg-primary text-white" : "bg-primary-light text-primary",
              )}
            >
              <Check className="w-3 h-3" />
            </span>
            <span
              className={cn(
                "leading-snug",
                p.highlighted ? "text-white/80" : "text-text-secondary",
              )}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-3">
        {p.revisionLimit !== undefined && (
          <p
            className={cn(
              "text-xs",
              p.highlighted ? "text-white/50" : "text-text-muted",
            )}
          >
            {p.revisionLimit} revision round{p.revisionLimit === 1 ? "" : "s"}{" "}
            included
          </p>
        )}
        {p.exclusions && p.exclusions.length > 0 && (
          <p
            className={cn(
              "text-xs leading-relaxed",
              p.highlighted ? "text-white/45" : "text-warning",
            )}
          >
            Excludes: {p.exclusions.join(", ")}.
          </p>
        )}

        <Link
          to={p.ctaUrl}
          className={cn(
            "group flex items-center justify-center gap-2 w-full px-5 py-3 rounded-button font-semibold text-sm transition-all duration-300",
            p.highlighted
              ? "bg-white text-navy hover:bg-blue-50 shadow-[0_6px_20px_rgba(255,255,255,0.15)]"
              : "border border-primary text-primary hover:bg-primary hover:text-white",
          )}
        >
          {p.ctaLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  if (p.highlighted) {
    return (
      <div className="rounded-card-lg p-[1.5px] bg-gradient-to-b from-primary via-primary/60 to-transparent shadow-card-hover">
        {card}
      </div>
    );
  }

  return card;
}

export function Pricing() {
  const [searchParams] = useSearchParams();
  const [market, setMarket] = useState<"india" | "international">(
    searchParams.get("market") === "international" &&
      pricingConfig.internationalEnabled
      ? "international"
      : "india",
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    serviceCategories[0]?.key ?? "graphic-design",
  );

  /* Tiered packages for the card grid */
  const tieredPackages = pricingPackages.filter(
    (p) =>
      p.enabled &&
      tieredIds.has(p.id) &&
      (activeCategory === "all" || p.category === activeCategory),
  );

  /* Addon packages — everything not referenced by a service */
  const addonPackages = pricingPackages.filter(
    (p) => p.enabled && !tieredIds.has(p.id),
  );

  /* Group addons by category */
  const addonsByCategory = serviceCategories
    .map((cat) => ({
      ...cat,
      items: addonPackages.filter((p) => p.category === cat.key),
    }))
    .filter((g) => g.items.length > 0);

  const countFor = (key: string) =>
    pricingPackages.filter(
      (p) => p.enabled && tieredIds.has(p.id) && p.category === key,
    ).length;

  const toggleMarket = (m: "india" | "international") => {
    if (m === "international" && !pricingConfig.internationalEnabled) return;
    setMarket(m);
  };

  const formatPrice = (price: number | null) =>
    price === null
      ? "On request"
      : market === "india"
        ? formatINR(price)
        : formatUSD(price);

  return (
    <>
      <SEO
        title="Transparent Pricing | Digital Growth Agency MovoX"
        description="Explore MovoX design, development and marketing packages. Transparent pricing for businesses across India. Get a custom quote."
        path="/pricing"
        image="/og-image.jpg"
      />

      {/* ===== Dark hero ===== */}
      <section className="relative overflow-hidden bg-navy pt-10 pb-16 md:pb-20">
        <div className="hero-grid" aria-hidden="true">
          <div
            className="hero-grid-lines"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            }}
          />
          <div
            className="hero-grid-accent"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(35,130,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,130,184,0.2) 1px, transparent 1px)",
            }}
          />
        </div>
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Pricing", href: "/pricing" },
                ]}
              />
            </div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Transparent Pricing
              </span>
            </motion.div>

            <motion.h1
              className="text-white mb-6 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              The Right Digital Solution for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Your Business
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              Explore our service packages and add-on services. Choose a
              starting point that fits your needs, or talk to us about a custom
              solution.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== Service packages ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter bar */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300",
                      activeCategory === cat.key
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-text-secondary border-border-default hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {cat.label}
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        activeCategory === cat.key
                          ? "bg-white/20 text-white"
                          : "bg-bg-soft text-text-muted",
                      )}
                    >
                      {countFor(cat.key)}
                    </span>
                  </button>
                ))}
              </div>

              {pricingConfig.internationalEnabled && (
                <div className="inline-flex p-1 rounded-full bg-bg-soft border border-border-default self-start lg:self-auto">
                  <button
                    onClick={() => toggleMarket("india")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                      market === "india"
                        ? "bg-white text-primary shadow-sm"
                        : "text-text-muted hover:text-text-primary",
                    )}
                  >
                    India (INR)
                  </button>
                  <button
                    onClick={() => toggleMarket("international")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                      market === "international"
                        ? "bg-white text-primary shadow-sm"
                        : "text-text-muted hover:text-text-primary",
                    )}
                  >
                    International (USD)
                  </button>
                </div>
              )}
            </motion.div>

            {/* International notice */}
            {market === "international" &&
              pricingConfig.internationalEnabled && (
                <div className="mb-8 flex items-start gap-3 px-5 py-4 bg-blue-50 rounded-card-lg border border-primary/15">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Viewing international rates (USD). These are proposed
                    starting prices, not verified international market averages.
                    India remains the default market.
                  </p>
                </div>
              )}

            {/* Package grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {tieredPackages.length > 0 ? (
                tieredPackages.map((p) => (
                  <motion.div key={p.id} variants={fadeUp}>
                    <PricingCard p={p} market={market} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 rounded-card-lg border-2 border-dashed border-border-default bg-bg-soft/50">
                  <div className="w-12 h-12 rounded-button bg-white border border-border-default text-text-muted flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <p className="text-text-secondary font-semibold mb-1">
                    No packages in this category
                  </p>
                  <p className="text-sm text-text-muted">
                    Try another category or request a custom quote.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Add-ons list ===== */}
      <section className="py-16 md:py-20 bg-bg-soft relative overflow-hidden">
        <div
          className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-5">
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Add-ons
                </span>
              </div>
              <h2 className="leading-tight">
                Individual services &{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  add-ons
                </span>
                .
              </h2>
              <p className="text-supporting text-text-muted max-w-2xl mx-auto mt-4">
                Need something specific? Add individual services to any package
                or request them on their own.
              </p>
            </div>

            <div className="space-y-10">
              {addonsByCategory.map((group) => (
                <div key={group.key}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-secondary mb-4 flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    {group.label}
                  </h3>

                  <div className="rounded-card-lg border border-border-default bg-white overflow-hidden shadow-card divide-y divide-border-default">
                    {group.items.map((item) => {
                      const showPromo =
                        item.id === "graphic-promo-5" &&
                        !pricingConfig.enableSocialMediaPromotion;
                      if (showPromo) return null;

                      return (
                        <div
                          key={item.id}
                          className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-6 py-4 hover:bg-bg-soft/70 transition-colors"
                        >
                          {/* Name + description */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {item.packageName}
                            </p>
                            {item.shortDescription && (
                              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                                {item.shortDescription}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                            <span className="text-sm font-bold text-text-primary whitespace-nowrap">
                              {formatPrice(item.price)}
                              {item.billingPeriod === "month" && (
                                <span className="text-text-muted font-normal">
                                  /mo
                                </span>
                              )}
                            </span>

                            <Link
                              to={item.ctaUrl}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all whitespace-nowrap"
                            >
                              Enquire
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Disclaimer, GST & Payment terms ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-7 rounded-card-lg bg-bg-soft border border-border-default">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm">
                    <Info className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    Pricing disclaimer
                  </h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {pricingDisclaimer}
                </p>
              </div>

              <div className="p-7 rounded-card-lg bg-bg-soft border border-border-default">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm">
                    <Receipt className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    Illustrative GST example
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Base price</span>
                    <span className="text-text-primary font-medium">
                      ₹{gstExample.basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>GST at {gstExample.gstRate}%</span>
                    <span className="text-text-primary font-medium">
                      ₹
                      {gstExample.gstAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="h-px bg-border-default my-2" />
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>Total</span>
                    <span>
                      ₹
                      {gstExample.total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-4 leading-relaxed">
                  {gstExample.label}
                </p>
              </div>
            </div>

            {/* Payment terms */}
            <div className="p-7 rounded-card-lg border border-border-default bg-white shadow-card">
              <h3 className="text-base font-bold text-text-primary mb-5">
                Payment terms
              </h3>
              <div className="divide-y divide-border-default">
                {paymentTerms.map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3"
                  >
                    <span className="text-sm text-text-secondary">{t.scope}</span>
                    <span className="text-sm font-semibold text-primary">
                      {t.terms}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Custom quote CTA ===== */}
      <section className="relative py-20 md:py-24 bg-navy overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="hero-grid" aria-hidden="true">
          <div
            className="hero-grid-lines"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            }}
          />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-5 leading-tight">
              Need something{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                more specific
              </span>
              ?
            </h2>
            <p className="text-blue-100/80 mb-9 max-w-xl mx-auto leading-relaxed">
              Tell us about your business, requirements and goals. We'll help
              define a suitable scope and prepare a custom proposal.
            </p>
            <Link
              to="/start-a-project"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
            >
              Request a Custom Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Pricing FAQ ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-soft border border-border-default shadow-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Pricing FAQ
                </span>
              </div>
              <h2 className="leading-tight">
                Answers before you{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  decide
                </span>
                .
              </h2>
            </div>

            <Accordion items={pricingFAQs} />

            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
              >
                Still have a question? Ask our team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final note */}
      <div className="pb-16 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="max-w-3xl mx-auto text-center text-xs text-text-muted">
            Prices are indicative starting prices. Final pricing depends on
            project scope. Contact us for a custom quote.
          </p>
        </div>
      </div>
    </>
  );
}
