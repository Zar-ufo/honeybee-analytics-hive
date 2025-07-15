
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { t } = useTranslation();

  // Fetch dashboard data
  const { data: invoices } = useQuery({
    queryKey: ["dashboard-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["dashboard-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["dashboard-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics
  const totalRevenue = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0) || 0;
  const totalCustomers = customers?.length || 0;
  const totalProducts = products?.length || 0;
  const pendingInvoices = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length || 0;

  // Generate monthly revenue data from payments
  const monthlyData = (() => {
    if (!payments) return [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = new Array(12).fill(0);
    
    payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date);
      if (paymentDate.getFullYear() === currentYear) {
        monthlyRevenue[paymentDate.getMonth()] += parseFloat(payment.amount.toString());
      }
    });
    
    return monthNames.map((name, index) => ({
      name,
      revenue: monthlyRevenue[index],
      expenses: monthlyRevenue[index] * 0.6 // Mock expenses as 60% of revenue
    }));
  })();

  // Generate invoice status data
  const invoiceStatusData = (() => {
    if (!invoices) return [];
    
    const statusCounts = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const colors = {
      draft: '#94A3B8',
      sent: '#3B82F6', 
      paid: '#10B981',
      overdue: '#EF4444',
      cancelled: '#6B7280'
    };
    
    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status as keyof typeof colors] || '#8B5CF6'
    }));
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('dashboard.revenueFromPayments', { count: payments?.length || 0 })}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalCustomers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('dashboard.activeCustomers')}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalProducts')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Package className="h-3 w-3 mr-1" />
              {t('dashboard.inInventory')}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.pendingInvoices')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <div className="flex items-center text-xs text-yellow-600">
              <FileText className="h-3 w-3 mr-1" />
              {t('dashboard.awaitingPayment')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.monthlyRevenue')}</CardTitle>
            <CardDescription>Revenue trends for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                <Bar dataKey="expenses" fill="hsl(var(--muted-foreground))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.invoiceStatusDistribution')}</CardTitle>
            <CardDescription>Current status of all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>Latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New invoice created", client: "Acme Corp", amount: "$2,500", time: "2 hours ago", status: "pending" },
              { action: "Payment received", client: "Tech Solutions", amount: "$1,200", time: "5 hours ago", status: "completed" },
              { action: "Product added", client: "Inventory", amount: "50 units", time: "1 day ago", status: "active" },
              { action: "Customer registered", client: "John Doe", amount: "", time: "2 days ago", status: "new" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.client}</p>
                </div>
                <div className="flex items-center gap-3">
                  {activity.amount && <span className="font-medium">{activity.amount}</span>}
                  <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
