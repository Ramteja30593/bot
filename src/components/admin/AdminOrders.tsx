import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";

const statusEmoji: Record<string, string> = {
  ordered: "📦", shipped: "🚛", out_for_delivery: "🚚", delivered: "✅",
};

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, brand))")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", orderId);
    if (error) { toast.error(error.message); return; }
    toast.success("Order status updated");
    fetchOrders();
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">🛒 Order Management</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-mono text-muted-foreground">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.order_status.map(s => (
                        <SelectItem key={s} value={s}>
                          {statusEmoji[s]} {s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-foreground">{item.products?.name} × {item.quantity}</span>
                    <span className="text-foreground font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</span>
                  <span className="font-bold text-foreground">₹{order.total_amount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
