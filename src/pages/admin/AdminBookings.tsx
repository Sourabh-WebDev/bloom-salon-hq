import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Eye, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore, Booking } from "@/store/adminStore";
import axios from "axios";


const AdminBookings = () => {
  const { bookings, updateBookingStatus, deleteBooking, addBooking, services, setServices, fetchBookings } = useAdminStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    service: "",
    date: "",
    time: "",
    paymentMethod: "cash" as "cash" | "online",
    amount: 0,
    notes: "",
  });

  const fetchServices = async (searchQuery = "") => {
    try {
      const url = searchQuery
        ? `/api/services/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/services";

      const { data } = await axios.get(url, {
        withCredentials: true
      });
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: Booking["status"]) => {
    updateBookingStatus(id, status);
    toast({
      title: "Booking Updated",
      description: `Booking status changed to ${status}`,
    });
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    toast({
      title: "Booking Deleted",
      description: "The booking has been removed",
    });
  };


  const handleAddBooking = async () => {
    if (
      !newBooking.customerName ||
      !newBooking.service ||
      !newBooking.date ||
      !newBooking.time
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(
        "/api/bookings",
        {
          customerName: newBooking.customerName,
          customerEmail: newBooking.customerEmail,
          customerPhone: newBooking.customerPhone,
          service: newBooking.service,
          date: newBooking.date,
          time: newBooking.time,
          paymentMethod: newBooking.paymentMethod,
          amount: newBooking.amount,
          notes: newBooking.notes,
        },
        { withCredentials: true }
      );

      // OPTIONAL: optimistic update (keeps UI instant)
      addBooking({
        id: Date.now().toString(),
        ...newBooking,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Booking Added",
        description: "New booking has been created",
      });

      setNewBooking({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        service: "",
        date: "",
        time: "",
        paymentMethod: "cash",
        amount: 0,
        notes: "",
      });

      setIsAddDialogOpen(false);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create booking",
        variant: "destructive",
      });
    }
  };


  return (
    <AdminLayout title="Bookings" subtitle="Manage all salon appointments">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-10 input-elegant"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] input-elegant">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Customer Name"
                className="input-elegant"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                className="input-elegant"
                value={newBooking.customerEmail}
                onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
              />
              <Input
                placeholder="Phone"
                className="input-elegant"
                value={newBooking.customerPhone}
                onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
              />
              <Select onValueChange={(value) => {
                const service = services.find(s => s.name === value);
                setNewBooking({ ...newBooking, service: value, amount: service?.price || 0 });
              }}>
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name} - ₹{service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  className="input-elegant"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                />
                <Input
                  type="time"
                  className="input-elegant"
                  value={newBooking.time}
                  onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                />
              </div>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, paymentMethod: value as "cash" | "online" })}>
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddBooking} className="w-full btn-primary">
                Create Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-elegant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{booking.service}</td>
                  <td className="py-4 px-4">
                    <p className="text-foreground">{booking.date}</p>
                    <p className="text-sm text-muted-foreground">{booking.time}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${booking.paymentMethod === "online" ? "bg-primary/10 text-primary" : "bg-accent/30 text-accent-foreground"
                      }`}>
                      {booking.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground">₹{booking.amount}</td>
                  <td className="py-4 px-4">
                    <Select value={booking.status} onValueChange={(value) => handleStatusChange(booking.id, value as Booking["status"])}>
                      <SelectTrigger className={`w-[130px] h-8 text-xs font-medium ${booking.status === "confirmed" ? "bg-green-100 text-green-700 border-green-200" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          booking.status === "completed" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-red-100 text-red-700 border-red-200"
                        }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50"
                        onClick={() => handleStatusChange(booking.id, "confirmed")}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(booking.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default AdminBookings;
