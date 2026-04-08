import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function WishlistPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wishlists")
      .select("*, products(*)")
      .eq("user_id", user.id);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const removeFromWishlist = async (id: string) => {
    await supabase.from("wishlists").delete().eq("id", id);
    toast.success("Removed from wishlist");
    fetchWishlist();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-destructive" /> My Wishlist
      </h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Your wishlist is empty. Chat with RetailBot to find products!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="shadow-card">
              <CardContent className="p-4">
                {item.products?.image_url && (
                  <img src={item.products.image_url} alt={item.products.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <h3 className="font-semibold text-foreground">{item.products?.name}</h3>
                <p className="text-sm text-muted-foreground">{item.products?.brand}</p>
                <p className="text-lg font-bold text-primary mt-1">₹{item.products?.price?.toLocaleString()}</p>
                <Button variant="ghost" size="sm" onClick={() => removeFromWishlist(item.id)} className="mt-2 text-destructive">
                  <Trash2 className="mr-1 h-4 w-4" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
