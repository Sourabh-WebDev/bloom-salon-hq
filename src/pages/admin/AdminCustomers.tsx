import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Phone, Mail, Calendar, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/adminStore";

const AdminCustomers = () => {
  const { customers, fetchCustomers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );



  return (
    <AdminLayout title="Customers" subtitle="View and manage your customer database">
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10 input-elegant"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="card-elegant"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{customer.name}</h3>
                <p className="text-sm text-muted-foreground">Customer since {customer.createdAt}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Last visit: {customer.lastVisit}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{customer.totalVisits}</p>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                  {customer.totalSpent.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
