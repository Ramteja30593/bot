import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export function AdminProducts() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"products"> | null>(null);
  const [form, setForm] = useState({ name: "", brand: "", category: "", price: "", stock_quantity: "", description: "", image_url: "" });

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", brand: "", category: "", price: "", stock_quantity: "", description: "", image_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Tables<"products">) => {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price: String(p.price), stock_quantity: String(p.stock_quantity),
      description: p.description || "", image_url: p.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name, brand: form.brand, category: form.category,
      price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity),
      description: form.description, image_url: form.image_url,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product added!");
    }
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">📦 Products</h2>
        <Button onClick={openAdd} className="gradient-primary text-primary-foreground">
          <Plus className="mr-1 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <Card key={p.id} className="shadow-card">
            <CardContent className="p-4">
              {p.image_url && <img src={p.image_url} alt={p.name} className="h-32 w-full object-cover rounded-lg mb-3" />}
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.brand} · {p.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">₹{p.price.toLocaleString()}</span>
                <span className={`text-sm ${p.stock_quantity < 5 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                  Stock: {p.stock_quantity}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                  <Pencil className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive">
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(["name", "brand", "category", "price", "stock_quantity", "description", "image_url"] as const).map(field => (
              <div key={field}>
                <Label className="capitalize">{field.replace("_", " ")}</Label>
                <Input value={(form as any)[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  type={field === "price" || field === "stock_quantity" ? "number" : "text"} />
              </div>
            ))}
            <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">
              {editing ? "Update" : "Add"} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
