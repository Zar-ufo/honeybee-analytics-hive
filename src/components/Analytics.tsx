import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

export function Analytics() {
  const [timeRange, setTimeRange] = useState("6months");

  // Fetch all data needed for analytics
  const { data: invoices } = useQuery({
    queryKey: ["analytics-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["analytics-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["analytics-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics
  const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  const totalInvoices = invoices?.length || 0;
  const totalCustomers = customers?.length || 0;
  const totalProducts = products?.length || 0;

  // Calculate conversion rate (paid invoices / total invoices)
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0;
  const conversionRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

  // Calculate average order value
  const avgOrderValue = paidInvoices > 0 ? totalRevenue / paidInvoices : 0;

  // Generate monthly revenue data from payments
  const monthlyData = (() => {
    if (!payments) return [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = new Array(12).fill(0);
    const monthlyTarget = new Array(12).fill(0);
    
    payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date);
      if (paymentDate.getFullYear() === currentYear) {
        monthlyRevenue[paymentDate.getMonth()] += Number(payment.amount);
      }
    });

    // Set targets as 120% of previous month or average
    const avgRevenue = monthlyRevenue.reduce((sum, val) => sum + val, 0) / 12;
    monthlyTarget.forEach((_, index) => {
      monthlyTarget[index] = Math.max(avgRevenue * 1.2, monthlyRevenue[index] * 1.1);
    });
    
    return monthNames.map((name, index) => ({
      month: name,
      revenue: monthlyRevenue[index],
      target: monthlyTarget[index],
      growth: index > 0 ? 
        ((monthlyRevenue[index] - monthlyRevenue[index - 1]) / (monthlyRevenue[index - 1] || 1)) * 100 : 0
    }));
  })();

  // Generate customer segments data
  const customerSegments = (() => {
    if (!invoices) return [];
    
    const customerSpending = new Map();
    invoices.forEach(invoice => {
      const current = customerSpending.get(invoice.customer_name) || 0;
      customerSpending.set(invoice.customer_name, current + Number(invoice.total_amount));
    });

    const spendingAmounts = Array.from(customerSpending.values());
    const enterprise = spendingAmounts.filter(amount => amount > 5000).length;
    const smb = spendingAmounts.filter(amount => amount >= 1000 && amount <= 5000).length;
    const individual = spendingAmounts.filter(amount => amount < 1000).length;
    const total = enterprise + smb + individual;

    if (total === 0) return [];

    return [
      { name: 'Enterprise', value: Math.round((enterprise / total) * 100), color: '#F59E0B' },
      { name: 'SMB', value: Math.round((smb / total) * 100), color: '#FCD34D' },
      { name: 'Individual', value: Math.round((individual / total) * 100), color: '#FEF3C7' },
    ];
  })();

  // Generate product performance data
  const productPerformance = (() => {
    if (!products) return [];
    
    return products.slice(0, 4).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 1000) + 100, // Mock sales data
      margin: Math.floor(Math.random() * 50) + 20, // Mock margin data
    }));
  })();

  // Generate growth data
  const growthData = [
    { name: 'Revenue Growth', value: 85, fill: '#F59E0B' },
    { name: 'Customer Growth', value: Math.min(100, (totalCustomers / 100) * 100), fill: '#FCD34D' },
    { name: 'Product Growth', value: Math.min(100, (totalProducts / 50) * 100), fill: '#FEF3C7' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{((totalRevenue / 10000) * 100).toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">from {payments?.length || 0} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              <TrendingUp className="h-3 w-3 mr-1" />
              {conversionRate > 50 ? '+' : ''}{(conversionRate - 50).toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">invoices to payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Badge className={`${avgOrderValue > 100 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
              {avgOrderValue > 100 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {avgOrderValue > 100 ? '+' : ''}{((avgOrderValue - 100) / 100 * 100).toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{Math.min(100, totalCustomers * 2).toFixed(0)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">active customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs target performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stackId="1" 
                  stroke="hsl(var(--muted-foreground))" 
                  fill="hsl(var(--muted))" 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="2" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Distribution by customer spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales volume and profit margins by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
                <Bar dataKey="margin" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>Key growth indicators progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={growthData}>
                <RadialBar dataKey="value" cornerRadius="10" />
                <Tooltip />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive view of key business indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { metric: "Total Invoices", value: totalInvoices.toString(), change: "+12.5%", trend: "up" },
              { metric: "Paid Invoices", value: paidInvoices.toString(), change: "+18.7%", trend: "up" },
              { metric: "Pending Invoices", value: (totalInvoices - paidInvoices).toString(), change: "-5.2%", trend: "down" },
              { metric: "Total Products", value: totalProducts.toString(), change: "+8.3%", trend: "up" },
              { metric: "Active Customers", value: totalCustomers.toString(), change: "+22.3%", trend: "up" },
              { metric: "Revenue Growth", value: `$${totalRevenue.toFixed(0)}`, change: "+15.8%", trend: "up" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{item.metric}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{item.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}