
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, CreditCard } from "lucide-react";

export function Reports() {
  // Fetch summary statistics
  const { data: summary } = useQuery({
    queryKey: ["reports-summary"],
    queryFn: async () => {
      const [invoicesRes, paymentsRes, customersRes] = await Promise.all([
        supabase.from("invoices").select("total_amount, status"),
        supabase.from("payments").select("amount"),
        supabase.from("invoices").select("customer_name").distinct(),
      ]);

      const totalRevenue = paymentsRes.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const totalInvoices = invoicesRes.data?.length || 0;
      const paidInvoices = invoicesRes.data?.filter(inv => inv.status === 'paid').length || 0;
      const uniqueCustomers = new Set(invoicesRes.data?.map(inv => inv.customer_name)).size || 0;

      return {
        totalRevenue,
        totalInvoices,
        paidInvoices,
        uniqueCustomers,
      };
    },
  });

  // Fetch monthly revenue data
  const { data: monthlyRevenue } = useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, payment_date")
        .order("payment_date");

      if (error) throw error;

      const monthlyData: Record<string, number> = {};
      data?.forEach(payment => {
        const month = new Date(payment.payment_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyData[month] = (monthlyData[month] || 0) + Number(payment.amount);
      });

      return Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      }));
    },
  });

  // Fetch invoice status distribution
  const { data: invoiceStatus } = useQuery({
    queryKey: ["invoice-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("status, total_amount");

      if (error) throw error;

      const statusData: Record<string, { count: number; amount: number }> = {};
      data?.forEach(invoice => {
        const status = invoice.status;
        if (!statusData[status]) {
          statusData[status] = { count: 0, amount: 0 };
        }
        statusData[status].count += 1;
        statusData[status].amount += Number(invoice.total_amount);
      });

      return Object.entries(statusData).map(([status, data]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: data.count,
        amount: data.amount,
      }));
    },
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold honey-text">Reports & Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalRevenue.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalInvoices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.paidInvoices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.uniqueCustomers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status} (${count})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {invoiceStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={invoiceStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'count' ? value : `$${Number(value).toFixed(2)}`,
                name === 'count' ? 'Count' : 'Amount'
              ]} />
              <Bar dataKey="count" fill="#8884d8" name="count" />
              <Bar dataKey="amount" fill="#82ca9d" name="amount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
