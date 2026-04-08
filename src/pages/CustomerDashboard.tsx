import { useAuth } from "@/hooks/useAuth";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";
import { Bot, Heart, LogOut, Package } from "lucide-react";
import { useState } from "react";
import { WishlistPanel } from "@/components/customer/WishlistPanel";
import { OrdersPanel } from "@/components/customer/OrdersPanel";

type View = "chat" | "wishlist" | "orders";

export default function CustomerDashboard() {
  const { signOut, user } = useAuth();
  const [view, setView] = useState<View>("chat");

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">RetailBot</h1>
            <p className="text-xs text-muted-foreground">AI Shopping Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "chat" ? "default" : "ghost"} size="sm" onClick={() => setView("chat")}>
            <Bot className="mr-1 h-4 w-4" /> Chat
          </Button>
          <Button variant={view === "wishlist" ? "default" : "ghost"} size="sm" onClick={() => setView("wishlist")}>
            <Heart className="mr-1 h-4 w-4" /> Wishlist
          </Button>
          <Button variant={view === "orders" ? "default" : "ghost"} size="sm" onClick={() => setView("orders")}>
            <Package className="mr-1 h-4 w-4" /> Orders
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "chat" && <ChatPanel />}
        {view === "wishlist" && <WishlistPanel />}
        {view === "orders" && <OrdersPanel />}
      </div>
    </div>
  );
}
