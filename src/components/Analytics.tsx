
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

const revenueData = [
  { month: 'Jan', revenue: 4000, target: 3500, growth: 12 },
  { month: 'Feb', revenue: 3000, target: 3200, growth: -6 },
  { month: 'Mar', revenue: 2000, target: 3800, growth: -33 },
  { month: 'Apr', revenue: 2780, target: 3600, growth: 39 },
  { month: 'May', revenue: 1890, target: 3400, growth: -32 },
  { month: 'Jun', revenue: 2390, target: 3900, growth: 26 },
  { month: 'Jul', revenue: 3490, target: 4100, growth: 46 },
];

const customerSegments = [
  { name: 'Enterprise', value: 45, color: '#F59E0B' },
  { name: 'SMB', value: 30, color: '#FCD34D' },
  { name: 'Individual', value: 25, color: '#FEF3C7' },
];

const productPerformance = [
  { name: 'Honey Products', sales: 850, margin: 35 },
  { name: 'Candles', sales: 450, margin: 42 },
  { name: 'Supplements', sales: 320, margin: 58 },
  { name: 'Raw Products', sales: 180, margin: 28 },
];

const growthData = [
  { name: 'Revenue Growth', value: 85, fill: '#F59E0B' },
  { name: 'Customer Growth', value: 70, fill: '#FCD34D' },
  { name: 'Product Growth', value: 65, fill: '#FEF3C7' },
];

export function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>
        <Select defaultValue="6months">
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
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,485</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.4%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24%</div>
            <p className="text-xs text-muted-foreground">from visitors to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Badge className="bg-red-100 text-red-800">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -1.2%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127.50</div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.1%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">lifetime value</p>
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
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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
            <CardDescription>Distribution by customer type</CardDescription>
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
            <CardDescription>Sales volume and profit margins by category</CardDescription>
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
              { metric: "Total Sessions", value: "24,582", change: "+12.5%", trend: "up" },
              { metric: "Bounce Rate", value: "34.2%", change: "-2.1%", trend: "down" },
              { metric: "Page Views", value: "156,892", change: "+18.7%", trend: "up" },
              { metric: "Session Duration", value: "3m 24s", change: "+0.8%", trend: "up" },
              { metric: "New Users", value: "8,943", change: "+22.3%", trend: "up" },
              { metric: "Return Rate", value: "68.5%", change: "+5.2%", trend: "up" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{item.metric}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
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
