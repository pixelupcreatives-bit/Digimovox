import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  Briefcase,
  FolderKanban,
  ScrollText,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  FolderOpen,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/store/types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission: Permission | "admin";
  /** Optional group heading shown above a cluster of items. */
  group?: string;
}

/**
 * Admin navigation, in display order.
 *
 * `permission` gates the item per the role→permission matrix; `"admin"`
 * means only the Admin role sees it.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, permission: "dashboard.view", group: "Overview" },
  { label: "Leads", to: "/admin/leads", icon: Inbox, permission: "leads.view", group: "Sales" },
  { label: "Blog", to: "/admin/blog", icon: Newspaper, permission: "content.blog", group: "Content" },
  { label: "Portfolio", to: "/admin/portfolio", icon: Briefcase, permission: "content.portfolio", group: "Content" },
  { label: "Projects", to: "/admin/projects", icon: FolderKanban, permission: "projects.view", group: "Operations" },
  { label: "Agreements", to: "/admin/agreements", icon: ScrollText, permission: "agreements.view", group: "Operations" },
  { label: "Invoices", to: "/admin/invoices", icon: Receipt, permission: "invoices.view", group: "Operations" },
  { label: "Quotations", to: "/admin/quotations", icon: FileSpreadsheet, permission: "quotations.view", group: "Operations" },
  { label: "Revenue", to: "/admin/revenue", icon: TrendingUp, permission: "revenue.view", group: "Operations" },
  { label: "File Manager", to: "/admin/files", icon: FolderOpen, permission: "files.view", group: "Delivery" },
  { label: "Team & Clients", to: "/admin/users", icon: Users, permission: "users.manage", group: "Manage" },
  { label: "Settings", to: "/admin/settings", icon: Settings, permission: "admin", group: "Manage" },
];
