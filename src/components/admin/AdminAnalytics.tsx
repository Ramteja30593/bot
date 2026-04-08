import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const COLORS = ["hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(262, 83%, 58%)", "hsl(25, 95%, 53%)", "hsl(349, 89%, 60%)"];

export function AdminAnalytics() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0, totalProducts: 0, totalOrders: 0 });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch sales
      const { data: sales } = await supabase.from("sales").select("*, products(name, category)");
      const { data: products } = await supabase.from("products").select("*");
      const { data: orders } = await supabase.from("orders").select("*");

      if (sales) {
        const totalRevenue = sales.reduce((sum, s) => sum + Number(s.revenue), 0);
        const totalSales = sales.reduce((sum, s) => sum + s.quantity_sold, 0);
        setStats({
          totalRevenue,
          totalSales,
          totalProducts: products?.length || 0,
          totalOrders: orders?.length || 0,
        });

        // Category breakdown
        const catMap: Record<string, number> = {};
        sales.forEach(s => {
          const cat = (s as any).products?.category || "Other";
          catMap[cat] = (catMap[cat] || 0) + Number(s.revenue);
        });
        setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value: Math.round(value) })));

        // Top products
        const prodMap: Record<string, { name: string; revenue: number; quantity: number }> = {};
        sales.forEach(s => {
          const name = (s as any).products?.name || "Unknown";
          if (!prodMap[name]) prodMap[name] = { name, revenue: 0, quantity: 0 };
          prodMap[name].revenue += Number(s.revenue);
          prodMap[name].quantity += s.quantity_sold;
        });
        setTopProducts(Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));
      }
    };
    fetchAnalytics();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, color: "text-primary" },
    { title: "Total Sales", value: stats.totalSales.toLocaleString(), icon: <TrendingUp className="h-5 w-5" />, color: "text-accent" },
    { title: "Products", value: stats.totalProducts, icon: <Package className="h-5 w-5" />, color: "text-chart-3" },
    { title: "Orders", value: stats.totalOrders, icon: <ShoppingCart className="h-5 w-5" />, color: "text-chart-4" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">📈 Sales Analytics</h2>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {statCards.map(s => (
          <Card key={s.title} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`${s.color}`}>{s.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products Bar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
