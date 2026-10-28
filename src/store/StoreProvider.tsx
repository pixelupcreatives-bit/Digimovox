import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import * as store from "./db";
import type { AdminDB, Permission, Role } from "./types";
import { can as roleCan } from "./types";
import type { InsightArticle, Project } from "@/types";

/**
 * React bindings over the admin store (`./db`).
 *
 * On mount the store tries to load from the Cloudflare Worker (Neon Postgres).
 * If the API is unreachable it transparently keeps using the local cache and
 * the UI shows an offline indicator. Both paths render from the same state.
 */

const bootstrapped = { current: false };

export function StoreProvider({ children }: { children: ReactNode }) {
  useSyncExternalStore(store.subscribe, store.getDB, store.getDB);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void store.bootstrapFromServer();
  }, []);

  return <>{children}</>;
}

/** Full database snapshot. */
export function useDB(): AdminDB {
  return useSyncExternalStore(store.subscribe, store.getDB, store.getDB);
}

/** Live / offline / unknown — drives the connection badge. */
export function useMode(): store.ConnectionMode {
  return useSyncExternalStore(store.subscribe, store.getMode, store.getMode);
}

export interface Auth {
  user: ReturnType<typeof store.currentUser>;
  role: Role | undefined;
  can: (permission: Permission) => boolean;
  loginRemote: typeof store.loginRemote;
  loginLocal: typeof store.loginLocal;
  logout: typeof store.logout;
}

/** Current session, role and permission helper. */
export function useAuth(): Auth {
  const db = useDB();
  const user = db.users.find((u) => u.id === db.session?.userId);
  const role = user?.role;
  return {
    user,
    role,
    can: (p: Permission) => roleCan(role, p),
    loginRemote: store.loginRemote,
    loginLocal: store.loginLocal,
    logout: store.logout,
  };
}

export interface Content {
  insights: InsightArticle[];
  projects: Project[];
  getInsight: (slug: string) => InsightArticle | undefined;
  getProject: (slug: string) => Project | undefined;
  insightsByCategory: (category: string) => InsightArticle[];
}

/** Live site content for the public Blog and Work pages. */
export function useContent(): Content {
  const db = useDB();
  const insights = db.blog;
  const projects = db.portfolio;
  return {
    insights,
    projects,
    getInsight: (slug: string) => insights.find((a) => a.slug === slug),
    getProject: (slug: string) => projects.find((p) => p.slug === slug),
    insightsByCategory: (category: string) => {
      const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, "-");
      const target = norm(category);
      return insights.filter((a) => norm(a.category) === target);
    },
  };
}

/* Store actions, re-exported for convenience. */
export {
  addLead,
  deleteLead,
  updateLeadStatus,
  savePost,
  deletePost,
  savePortfolioItem,
  deletePortfolioItem,
  saveUser,
  deleteUser,
  saveProject,
  deleteProject,
  saveAgreement,
  deleteAgreement,
  saveInvoice,
  deleteInvoice,
  saveQuotation,
  deleteQuotation,
  saveRevenue,
  deleteRevenue,
  saveFile,
  deleteFile,
  uploadFile,
  saveSetting,
  refreshData,
  refreshFromServer,
  bootstrapFromServer,
  uid,
  hasLiveBackend,
} from "./db";
