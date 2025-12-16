import { motion } from "framer-motion";
import { CreditCard, Banknote, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/adminStore";

const monthlyData = [
  { name: "Jan", cash: 32000, online: 48000 },
  { name: "Feb", cash: 28000, online: 52000 },
  { name: "Mar", cash: 35000, online: 58000 },
  { name: "Apr", cash: 42000, online: 62000 },
  { name: "May", cash: 38000, online: 68000 },
  { name: "Jun", cash: 45000, online: 75000 },
];

const dailyTrend = [
  { day: "1", amount: 8500 },
  { day: "5", amount: 12000 },
  { day: "10", amount: 9800 },
  { day: "15", amount: 15200 },
  { day: "20", amount: 11500 },
  { day: "25", amount: 18000 },
  { day: "30", amount: 14500 },
];

const AdminPayments = () => {
  const { bookings } = useAdminStore();

  const totalCash = bookings
    .filter((b) => b.status === "completed" && b.paymentMethod === "cash")
    .reduce((sum, b) => sum + b.amount, 0) + 125000;

  const totalOnline = bookings
    .filter((b) => b.status === "completed" && b.paymentMethod === "online")
    .reduce((sum, b) => sum + b.amount, 0) + 285000;

  const pendingPayments = bookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  const recentTransactions = bookings
    .filter((b) => b.status === "completed")
    .slice(0, 8);

  return (
    <AdminLayout title="Payments" subtitle="Monitor cash and online payment flows">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-elegant bg-gradient-to-br from-primary/20 to-primary/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Online Payments</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">₹{totalOnline.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% this month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card-elegant bg-gradient-to-br from-accent/30 to-accent/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Cash Payments</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">₹{totalCash.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.3% this month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card-elegant bg-gradient-to-br from-champagne/40 to-champagne/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-champagne/40 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">₹{(totalCash + totalOnline).toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>+10.8% this month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card-elegant bg-gradient-to-br from-yellow-100 to-yellow-50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-200 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-700" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">₹{pendingPayments.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground mt-2">{bookings.filter(b => b.status === "pending").length} bookings</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card-elegant"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Monthly Comparison</h3>
          <p className="text-sm text-muted-foreground mb-6">Cash vs Online payments</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
              <XAxis dataKey="name" stroke="hsl(340, 10%, 45%)" />
              <YAxis stroke="hsl(340, 10%, 45%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(30, 25%, 97%)",
                  border: "1px solid hsl(30, 20%, 88%)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="cash" fill="hsl(40, 60%, 70%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="online" fill="hsl(350, 50%, 65%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="card-elegant"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Daily Revenue Trend</h3>
          <p className="text-sm text-muted-foreground mb-6">This month's daily earnings</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 88%)" />
              <XAxis dataKey="day" stroke="hsl(340, 10%, 45%)" />
              <YAxis stroke="hsl(340, 10%, 45%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(30, 25%, 97%)",
                  border: "1px solid hsl(30, 20%, 88%)",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(350, 50%, 65%)"
                strokeWidth={3}
                dot={{ fill: "hsl(350, 50%, 65%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="card-elegant"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Recent Transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 px-4 font-medium text-foreground">{transaction.customerName}</td>
                  <td className="py-4 px-4 text-foreground">{transaction.service}</td>
                  <td className="py-4 px-4 text-muted-foreground">{transaction.date}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      transaction.paymentMethod === "online" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-accent/30 text-accent-foreground"
                    }`}>
                      {transaction.paymentMethod === "online" ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-foreground">₹{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminPayments;
