import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart3, Box, LogOut, Package, ShoppingCart } from "lucide-react";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminInventory } from "@/components/admin/AdminInventory";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

type AdminView = "products" | "orders" | "inventory" | "analytics";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [view, setView] = useState<AdminView>("products");

  const navItems: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "products", label: "Products", icon: <Box className="h-4 w-4" /> },
    { key: "orders", label: "Orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { key: "inventory", label: "Inventory", icon: <Package className="h-4 w-4" /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">RetailBot Store</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setView(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                view === item.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {view === "products" && <AdminProducts />}
        {view === "orders" && <AdminOrders />}
        {view === "inventory" && <AdminInventory />}
        {view === "analytics" && <AdminAnalytics />}
      </main>
    </div>
  );
}
