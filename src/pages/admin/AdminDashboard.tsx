import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/adminStore";

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseBookingDate = (rawDate: string) => {
  const parsed = new Date(rawDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date(`${rawDate}T00:00:00`);
};

const getChangePercent = (current: number, previous: number) => {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

const AdminDashboard = () => {
  const { bookings, customers } = useAdminStore();

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );

  const {
    totalRevenue,
    avgBookingValue,
    revenueData,
    paymentDistribution,
    onlineShare,
    cashShare,
    revenueChange,
    avgBookingChange,
  } = useMemo(() => {
    const revenueBookings = bookings.filter((b) => b.status !== "cancelled");
    const totalRevenue = revenueBookings.reduce((sum, b) => sum + b.amount, 0);
    const avgBookingValue = revenueBookings.length ? totalRevenue / revenueBookings.length : 0;

    const now = new Date();
    const startCurrent = new Date(now);
    startCurrent.setHours(0, 0, 0, 0);
    startCurrent.setDate(startCurrent.getDate() - 6);

    const endCurrent = new Date(now);
    endCurrent.setHours(23, 59, 59, 999);

    const startPrevious = new Date(startCurrent);
    startPrevious.setDate(startPrevious.getDate() - 7);

    const endPrevious = new Date(startCurrent);
    endPrevious.setMilliseconds(endPrevious.getMilliseconds() - 1);

    const currentWeekBookings = revenueBookings.filter((booking) => {
      const bookingDate = parseBookingDate(booking.date);
      return bookingDate >= startCurrent && bookingDate <= endCurrent;
    });

    const previousWeekBookings = revenueBookings.filter((booking) => {
      const bookingDate = parseBookingDate(booking.date);
      return bookingDate >= startPrevious && bookingDate <= endPrevious;
    });

    const currentWeekRevenue = currentWeekBookings.reduce((sum, booking) => sum + booking.amount, 0);
    const previousWeekRevenue = previousWeekBookings.reduce((sum, booking) => sum + booking.amount, 0);
    const currentWeekAvg = currentWeekBookings.length ? currentWeekRevenue / currentWeekBookings.length : 0;
    const previousWeekAvg = previousWeekBookings.length ? previousWeekRevenue / previousWeekBookings.length : 0;

    const revenueChange = getChangePercent(currentWeekRevenue, previousWeekRevenue);
    const avgBookingChange = getChangePercent(currentWeekAvg, previousWeekAvg);

    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startCurrent);
      date.setDate(startCurrent.getDate() + index);
      return {
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        key: getDateKey(date),
        cash: 0,
        online: 0,
      };
    });

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    currentWeekBookings.forEach((booking) => {
      const key = getDateKey(parseBookingDate(booking.date));
      const bucket = bucketByKey.get(key);
      if (!bucket) return;
      if (booking.paymentMethod === "cash") {
        bucket.cash += booking.amount;
      } else {
        bucket.online += booking.amount;
      }
    });

    const revenueData = buckets.map(({ key, ...bucket }) => bucket);
    const cashRevenue = revenueBookings
      .filter((b) => b.paymentMethod === "cash")
      .reduce((sum, b) => sum + b.amount, 0);
    const onlineRevenue = revenueBookings
      .filter((b) => b.paymentMethod === "online")
      .reduce((sum, b) => sum + b.amount, 0);
    const onlineShare = totalRevenue ? (onlineRevenue / totalRevenue) * 100 : 0;
    const cashShare = totalRevenue ? (cashRevenue / totalRevenue) * 100 : 0;

    const paymentDistribution = [
      { name: "Online", value: Number(onlineShare.toFixed(1)), color: "hsl(350, 50%, 65%)" },
      { name: "Cash", value: Number(cashShare.toFixed(1)), color: "hsl(40, 60%, 70%)" },
    ];

    return {
      totalRevenue,
      avgBookingValue,
      revenueData,
      paymentDistribution,
      onlineShare,
      cashShare,
      revenueChange,
      avgBookingChange,
    };
  }, [bookings]);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      change: "+12%",
      isPositive: true,
      icon: Calendar,
      color: "from-primary/20 to-primary/5",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
      isPositive: revenueChange >= 0,
      icon: DollarSign,
      color: "from-accent/30 to-accent/5",
    },
    {
      title: "Total Customers",
      value: customers.length.toString(),
      change: "+18%",
      isPositive: true,
      icon: Users,
      color: "from-champagne/40 to-champagne/5",
    },
    {
      title: "Avg. Booking Value",
      value: `₹${Math.round(avgBookingValue).toLocaleString()}`,
      change: `${avgBookingChange >= 0 ? "+" : ""}${avgBookingChange.toFixed(1)}%`,
      isPositive: avgBookingChange >= 0,
      icon: TrendingUp,
      color: "from-gold/20 to-gold/5",
    },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`card-elegant bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.isPositive ? "text-green-600" : "text-red-500"}`}>
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 card-elegant"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Revenue Flow</h3>
              <p className="text-sm text-muted-foreground">Cash vs Online payments this week</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Cash</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(350, 50%, 65%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(350, 50%, 65%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(40, 60%, 70%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(40, 60%, 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="online"
                stroke="hsl(350, 50%, 65%)"
                fillOpacity={1}
                fill="url(#colorOnline)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="cash"
                stroke="hsl(40, 60%, 70%)"
                fillOpacity={1}
                fill="url(#colorCash)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="card-elegant"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Payment Distribution</h3>
          <p className="text-sm text-muted-foreground mb-6">Online vs Cash</p>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="font-semibold text-foreground">{onlineShare.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Cash</p>
                <p className="font-semibold text-foreground">{cashShare.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="card-elegant"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Upcoming Bookings</h3>
            <p className="text-sm text-muted-foreground">{upcomingBookings.length} appointments scheduled</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{booking.service}</td>
                  <td className="py-4 px-4">
                    <p className="text-foreground">{booking.date}</p>
                    <p className="text-sm text-muted-foreground">{booking.time}</p>
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground">₹{booking.amount}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
