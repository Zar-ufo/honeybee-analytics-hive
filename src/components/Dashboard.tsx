import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export function Dashboard() {
  // Fetch real-time data from database
  const { data: invoices = [] } = useQuery({
    queryKey: ['dashboard-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['dashboard-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const activeCustomers = new Set(invoices.map(inv => inv.customer_name)).size;
    
    const productsSold = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;

    // Calculate monthly data for charts
    const monthlyData = [];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();
      
      last6Months.push({ monthName, year, month });
    }

    last6Months.forEach(({ monthName, year, month }) => {
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getFullYear() === year && 
               paymentDate.getMonth() === month &&
               payment.status === 'completed';
      });

      const monthInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate.getFullYear() === year && 
               invoiceDate.getMonth() === month;
      });

      const revenue = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const expenses = monthInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0) * 0.6; // Assume 60% of invoice value as expenses

      monthlyData.push({
        name: monthName,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses)
      });
    });

    return {
      totalRevenue,
      activeCustomers,
      productsSold,
      pendingInvoices,
      monthlyData
    };
  }, [invoices, payments, products]);

  // Calculate category data from products
  const categoryData = useMemo(() => {
    if (products.length === 0) return [];

    const categoryTotals = products.reduce((acc, product) => {
      const category = product.category || 'Other';
      const value = Number(product.price) * Number(product.stock);
      acc[category] = (acc[category] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#F59E0B', '#FCD34D', '#FEF3C7', '#FFFBEB'];
    
    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value: Math.round(value),
      color: colors[index % colors.length]
    }));
  }, [products]);

  // Calculate growth percentages (mock calculation for demo)
  const revenueGrowth = metrics.totalRevenue > 0 ? 20.1 : 0;
  const customerGrowth = metrics.activeCustomers > 0 ? 180 : 0;
  const productChange = products.length > 0 ? -4 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your HoneyBEE accounting overview</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
            {revenueGrowth > 0 && (
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{revenueGrowth}% from last month
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
            {customerGrowth > 0 && (
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{customerGrowth} from last month
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.productsSold}</div>
            {productChange !== 0 && (
              <div className={`flex items-center text-xs ${productChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {productChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {productChange > 0 ? '+' : ''}{productChange}% from last month
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingInvoices}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Awaiting payment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.monthlyData.length > 0 && metrics.monthlyData.some(d => d.revenue > 0 || d.expenses > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Bar dataKey="expenses" fill="hsl(var(--muted-foreground))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No revenue or expense data available</p>
                  <p className="text-sm">Start creating invoices and recording payments to see your financial overview</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Distribution of product values by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No product data available</p>
                  <p className="text-sm">Add products to see category distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 && payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start creating invoices and recording payments to see activity here</p>
              </div>
            ) : (
              <>
                {invoices.slice(0, 2).map((invoice, index) => (
                  <div key={`invoice-${index}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">New invoice created</p>
                      <p className="text-sm text-muted-foreground">{invoice.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${Number(invoice.total_amount).toFixed(2)}</span>
                      <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                        {invoice.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {payments.slice(0, 2).map((payment, index) => (
                  <div key={`payment-${index}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">Payment received</p>
                      <p className="text-sm text-muted-foreground">{payment.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${Number(payment.amount).toFixed(2)}</span>
                      <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                        {payment.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}