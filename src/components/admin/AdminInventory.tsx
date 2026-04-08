import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export function AdminInventory() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").order("stock_quantity", { ascending: true }).then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  const lowStock = products.filter(p => p.stock_quantity < 5);
  const inStock = products.filter(p => p.stock_quantity >= 5);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">📊 Inventory Management</h2>

      {lowStock.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5" /> Low Stock Alerts ({lowStock.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {lowStock.map(p => (
              <Card key={p.id} className="border-destructive/30 shadow-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{p.name}</h4>
                    <p className="text-sm text-muted-foreground">{p.brand} · {p.category}</p>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    ⚠️ {p.stock_quantity} left
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
        <CheckCircle className="h-5 w-5 text-accent" /> All Products
      </h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Brand</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-right text-foreground">₹{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{p.stock_quantity}</td>
                <td className="px-4 py-3 text-center">
                  {p.stock_quantity === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : p.stock_quantity < 5 ? (
                    <Badge variant="outline" className="border-destructive/30 text-destructive">Low</Badge>
                  ) : (
                    <Badge variant="outline" className="border-accent/30 text-accent">In Stock</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
