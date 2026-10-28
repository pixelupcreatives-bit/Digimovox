import {
  Rocket,
  Sparkles,
  TrendingUp,
  Boxes,
  Palette,
  Monitor,
  Smartphone,
  Megaphone,
  Layers,
  Store,
  Building2,
  Users,
  Heart,
  Briefcase,
  Globe,
  Wrench,
  HelpCircle,
  IndianRupee,
  Zap,
  Clock,
  Calendar,
  Compass,
  Mail,
  Phone,
  MessageCircle,
  Video,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the string icon keys used in @/data/projectEnquiry to Lucide components.
 * Keeps the data layer free of UI imports.
 */
const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  boxes: Boxes,
  palette: Palette,
  monitor: Monitor,
  smartphone: Smartphone,
  megaphone: Megaphone,
  layers: Layers,
  store: Store,
  building2: Building2,
  users: Users,
  heart: Heart,
  briefcase: Briefcase,
  globe: Globe,
  wrench: Wrench,
  "help-circle": HelpCircle,
  "indian-rupee": IndianRupee,
  zap: Zap,
  clock: Clock,
  calendar: Calendar,
  compass: Compass,
  mail: Mail,
  phone: Phone,
  "message-circle": MessageCircle,
  video: Video,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Layers;
}
