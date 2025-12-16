import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Percent, Calendar, Users, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore, Offer } from "@/store/adminStore";

const AdminOffers = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdminStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercent: 0,
    validFrom: "",
    validTo: "",
    isActive: true,
    usageCount: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercent: 0,
      validFrom: "",
      validTo: "",
      isActive: true,
      usageCount: 0,
    });
    setEditingOffer(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.discountPercent || !formData.validFrom || !formData.validTo) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingOffer) {
      updateOffer(editingOffer.id, formData);
      toast({ title: "Offer Updated", description: "Offer has been updated successfully" });
    } else {
      addOffer(formData);
      toast({ title: "Offer Created", description: "New offer has been created" });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discountPercent: offer.discountPercent,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      isActive: offer.isActive,
      usageCount: offer.usageCount,
    });
    setIsAddDialogOpen(true);
  };

  const handleToggleActive = (offer: Offer) => {
    updateOffer(offer.id, { isActive: !offer.isActive });
    toast({
      title: offer.isActive ? "Offer Deactivated" : "Offer Activated",
      description: `${offer.title} has been ${offer.isActive ? "deactivated" : "activated"}`,
    });
  };

  const handleDelete = (id: string) => {
    deleteOffer(id);
    toast({ title: "Offer Deleted", description: "Offer has been removed" });
  };

  return (
    <AdminLayout title="Offers & Promotions" subtitle="Create and manage discount offers">
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Offer Title"
                className="input-elegant"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                className="input-elegant"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Discount Percentage"
                className="input-elegant"
                value={formData.discountPercent || ""}
                onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Valid From</label>
                  <Input
                    type="date"
                    className="input-elegant"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Valid To</label>
                  <Input
                    type="date"
                    className="input-elegant"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full btn-primary">
                {editingOffer ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`card-elegant relative overflow-hidden ${!offer.isActive && "opacity-60"}`}
          >
            {/* Discount Badge */}
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 rounded-full bg-gradient-rose flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <span className="text-xl font-bold">{offer.discountPercent}%</span>
                  <p className="text-xs">OFF</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between mb-4 pr-20">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {offer.validFrom} - {offer.validTo}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  Used {offer.usageCount} times
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button onClick={() => handleToggleActive(offer)} className="text-muted-foreground hover:text-foreground transition-colors">
                {offer.isActive ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <ToggleRight className="w-6 h-6" />
                    <span className="text-sm">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ToggleLeft className="w-6 h-6" />
                    <span className="text-sm">Inactive</span>
                  </div>
                )}
              </button>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(offer)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(offer.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
