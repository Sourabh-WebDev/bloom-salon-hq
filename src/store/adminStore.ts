import { create } from "zustand";

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentMethod: "cash" | "online";
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageCount: number;
}

interface AdminStore {
  bookings: Booking[];
  services: Service[];
  customers: Customer[];
  offers: Offer[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addOffer: (offer: Omit<Offer, "id">) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample data
const initialBookings: Booking[] = [
  {
    id: "1",
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    customerPhone: "+91 98765 43210",
    service: "Bridal Makeup",
    date: "2024-12-20",
    time: "10:00 AM",
    status: "confirmed",
    paymentMethod: "online",
    amount: 5000,
    createdAt: "2024-12-15",
  },
  {
    id: "2",
    customerName: "Ananya Patel",
    customerEmail: "ananya@email.com",
    customerPhone: "+91 87654 32109",
    service: "Hair Coloring",
    date: "2024-12-18",
    time: "2:00 PM",
    status: "pending",
    paymentMethod: "cash",
    amount: 1500,
    createdAt: "2024-12-14",
  },
  {
    id: "3",
    customerName: "Meera Reddy",
    customerEmail: "meera@email.com",
    customerPhone: "+91 76543 21098",
    service: "Full Body Spa",
    date: "2024-12-19",
    time: "11:00 AM",
    status: "confirmed",
    paymentMethod: "online",
    amount: 3500,
    createdAt: "2024-12-13",
  },
  {
    id: "4",
    customerName: "Kavya Nair",
    customerEmail: "kavya@email.com",
    customerPhone: "+91 65432 10987",
    service: "Facial Treatment",
    date: "2024-12-17",
    time: "4:00 PM",
    status: "completed",
    paymentMethod: "cash",
    amount: 800,
    createdAt: "2024-12-12",
  },
  {
    id: "5",
    customerName: "Sneha Gupta",
    customerEmail: "sneha@email.com",
    customerPhone: "+91 54321 09876",
    service: "Hair Cut & Styling",
    date: "2024-12-21",
    time: "3:00 PM",
    status: "pending",
    paymentMethod: "online",
    amount: 500,
    createdAt: "2024-12-16",
  },
];

const initialServices: Service[] = [
  { id: "1", name: "Hair Cut & Styling", category: "Hair", price: 500, duration: "45 min", description: "Expert hair cutting and styling", isActive: true },
  { id: "2", name: "Hair Coloring", category: "Hair", price: 1500, duration: "2 hrs", description: "Professional hair coloring services", isActive: true },
  { id: "3", name: "Bridal Makeup", category: "Makeup", price: 5000, duration: "2 hrs", description: "Complete bridal makeover", isActive: true },
  { id: "4", name: "Classic Facial", category: "Facial", price: 800, duration: "45 min", description: "Deep cleansing facial", isActive: true },
  { id: "5", name: "Full Body Spa", category: "Spa", price: 3500, duration: "3 hrs", description: "Relaxing full body spa treatment", isActive: true },
  { id: "6", name: "Manicure", category: "Nails", price: 400, duration: "30 min", description: "Classic manicure service", isActive: true },
];

const initialCustomers: Customer[] = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", totalVisits: 12, totalSpent: 45000, lastVisit: "2024-12-15", createdAt: "2024-01-10" },
  { id: "2", name: "Ananya Patel", email: "ananya@email.com", phone: "+91 87654 32109", totalVisits: 8, totalSpent: 28000, lastVisit: "2024-12-10", createdAt: "2024-02-15" },
  { id: "3", name: "Meera Reddy", email: "meera@email.com", phone: "+91 76543 21098", totalVisits: 15, totalSpent: 62000, lastVisit: "2024-12-12", createdAt: "2023-11-20" },
  { id: "4", name: "Kavya Nair", email: "kavya@email.com", phone: "+91 65432 10987", totalVisits: 5, totalSpent: 12000, lastVisit: "2024-12-05", createdAt: "2024-06-01" },
];

const initialOffers: Offer[] = [
  { id: "1", title: "First Visit Discount", description: "20% off on first visit", discountPercent: 20, validFrom: "2024-12-01", validTo: "2024-12-31", isActive: true, usageCount: 45 },
  { id: "2", title: "Bridal Season Special", description: "15% off on bridal packages", discountPercent: 15, validFrom: "2024-12-01", validTo: "2025-02-28", isActive: true, usageCount: 12 },
  { id: "3", title: "Spa Sunday", description: "10% off on all spa services every Sunday", discountPercent: 10, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 28 },
];

export const useAdminStore = create<AdminStore>((set) => ({
  bookings: initialBookings,
  services: initialServices,
  customers: initialCustomers,
  offers: initialOffers,

  addBooking: (booking) =>
    set((state) => ({
      bookings: [
        ...state.bookings,
        { ...booking, id: generateId(), createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),

  updateBooking: (id, booking) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...booking } : b)),
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  addService: (service) =>
    set((state) => ({
      services: [...state.services, { ...service, id: generateId() }],
    })),

  updateService: (id, service) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...service } : s)),
    })),

  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [
        ...state.customers,
        { ...customer, id: generateId(), createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),

  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...customer } : c)),
    })),

  addOffer: (offer) =>
    set((state) => ({
      offers: [...state.offers, { ...offer, id: generateId() }],
    })),

  updateOffer: (id, offer) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === id ? { ...o, ...offer } : o)),
    })),

  deleteOffer: (id) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== id),
    })),
}));
