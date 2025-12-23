import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore, Service } from "@/store/adminStore";
import axios from "axios";

const categories = ["Hair", "Facial", "Makeup", "Spa", "Nails", "Waxing"];
const generateId = () => Math.random().toString(36).substring(2, 11);

const AdminServices = () => {
  const { services, addService, updateService, deleteService, setServices } = useAdminStore();
  const { toast } = useToast();

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
  }, [setServices]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    duration: "",
    description: "",
    isActive: true,
  });

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await fetchServices(query.trim());
    } else {
      await fetchServices();
    }
  };

  const filteredServices = services;

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: 0,
      duration: "",
      description: "",
      isActive: true,
    });
    setEditingService(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingService) {
        await axios.put(`/api/services?id=${editingService._id}`, formData, {
          withCredentials: true
        });
        updateService(editingService.id, formData);
        toast({ title: "Service Updated", description: "Service has been updated successfully" });
      } else {
        const { data } = await axios.post("/api/services", formData, {
          withCredentials: true
        });
        addService({ ...data, id: data._id || generateId() });
        toast({ title: "Service Added", description: "New service has been added" });
      }

      resetForm();
      setIsAddDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      description: service.description,
      isActive: service.isActive,
    });
    setIsAddDialogOpen(true);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const serviceId = service._id || service.id;
      await axios.patch(`/api/services?id=${serviceId}`, {
        isActive: !service.isActive
      }, {
        withCredentials: true
      });
      updateService(service.id, { isActive: !service.isActive });
      toast({
        title: service.isActive ? "Service Deactivated" : "Service Activated",
        description: `${service.name} has been ${service.isActive ? "deactivated" : "activated"}`,
      });
    } catch (error) {
      console.error("Failed to toggle service:", error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (service: Service) => {
    try {
      await axios.delete(`/api/services?id=${service._id}`, {
        withCredentials: true
      });
      deleteService(service._id);
      toast({ title: "Service Deleted", description: "Service has been removed" });
      fetchServices()
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Services" subtitle="Manage your salon services">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-10 input-elegant"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Service Name"
                className="input-elegant"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Price (₹)"
                  className="input-elegant"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
                <Input
                  placeholder="Duration (e.g., 45 min)"
                  className="input-elegant"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Description"
                className="input-elegant"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Button onClick={handleSubmit} className="w-full btn-primary">
                {editingService ? "Update Service" : "Add Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`card-elegant ${!service.isActive && "opacity-60"}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {service.category}
                </span>
              </div>
              <button onClick={() => handleToggleActive(service)} className="text-muted-foreground hover:text-foreground">
                {service.isActive ? (
                  <ToggleRight className="w-6 h-6 text-green-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            </div>

            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-primary">₹{service.price}</span>
              <span className="text-sm text-muted-foreground">{service.duration}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(service)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(service)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
