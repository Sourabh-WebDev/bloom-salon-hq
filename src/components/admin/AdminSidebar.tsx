import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  CreditCard,
  Gift,
  Sparkles,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Calendar, label: "Bookings", path: "/admin/bookings" },
  { icon: Scissors, label: "Services", path: "/admin/services" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Gift, label: "Offers", path: "/admin/offers" },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-display text-xl font-semibold text-foreground">
                Bella Rosa
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Back to Site</span>}
          </Link>

          {onToggle && (
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
              {!isCollapsed && <span className="font-medium">Collapse</span>}
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
