import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const statusConfig: Record<string, { label: string; emoji: string; color: string }> = {
  ordered: { label: "Ordered", emoji: "📦", color: "bg-chart-4/10 text-chart-4 border-chart-4/30" },
  shipped: { label: "Shipped", emoji: "🚛", color: "bg-primary/10 text-primary border-primary/30" },
  out_for_delivery: { label: "Out for Delivery", emoji: "🚚", color: "bg-chart-3/10 text-chart-3 border-chart-3/30" },
  delivered: { label: "Delivered", emoji: "✅", color: "bg-accent/10 text-accent border-accent/30" },
};

export function OrdersPanel() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" /> My Orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet. Start shopping with RetailBot!</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.ordered;
            return (
              <Card key={order.id} className="shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <Badge variant="outline" className={status.color}>
                      {status.emoji} {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.products?.name} × {item.quantity}</span>
                        <span className="font-medium text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-foreground">₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
