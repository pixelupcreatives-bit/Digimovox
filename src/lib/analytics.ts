import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type AnalyticsParams = Record&lt;string, string | number | boolean&gt;;
type Gtag = (...args: unknown[]) =&gt; void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let initialized = false;
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function initializeAnalytics() {
  if (!measurementId || typeof window === "undefined" || initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (!measurementId || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

export function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() =&gt; {
    initializeAnalytics();
    if (!measurementId || pathname.startsWith("/admin")) return;
    trackEvent("page_view", {
      page_path: `${pathname}${search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  useEffect(() =&gt; {
    if (!measurementId) return;
    const startedForms = new WeakSet&lt;HTMLFormElement&gt;();
    const onFocusIn = (event: FocusEvent) =&gt; {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const form = target.closest("form");
      if (!form || startedForms.has(form)) return;
      startedForms.add(form);
      trackEvent("form_start", { form_id: form.id || "unknown", form_name: window.location.pathname });
    };
    const onClick = (event: MouseEvent) =&gt; {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href") || "";
      if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
        trackEvent("whatsapp_click", { link_url: href });
      } else if (href.startsWith("tel:")) {
        trackEvent("phone_click", { link_url: href });
      }
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick);
    return () =&gt; {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
