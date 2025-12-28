import axios from "axios";
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
  _id?: string;
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

export interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  service?: string;
  isApproved: boolean;
  createdAt: string;
}

interface AdminStore {
  bookings: Booking[];
  services: Service[];
  customers: Customer[];
  offers: Offer[];
  reviews: Review[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (
    id: string,
    status: Booking["status"]
  ) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  fetchBookings: () => Promise<void>;

  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  setServices: (services: Service[]) => void;
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addOffer: (offer: Omit<Offer, "id">) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  getApprovedReviews: () => Review[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample data

const initialServices: Service[] = [];

const initialCustomers: Customer[] = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", totalVisits: 12, totalSpent: 45000, lastVisit: "2024-12-15", createdAt: "2024-01-10" },
  { id: "2", name: "Ananya Patel", email: "ananya@email.com", phone: "+91 87654 32109", totalVisits: 8, totalSpent: 28000, lastVisit: "2024-12-10", createdAt: "2024-02-15" },
  { id: "3", name: "Meera Reddy", email: "meera@email.com", phone: "+91 76543 21098", totalVisits: 15, totalSpent: 62000, lastVisit: "2024-12-12", createdAt: "2023-11-20" },
  { id: "4", name: "Kavya Nair", email: "kavya@email.com", phone: "+91 65432 10987", totalVisits: 5, totalSpent: 12000, lastVisit: "2024-12-05", createdAt: "2024-06-01" },
];

const initialOffers: Offer[] = [
  { id: "1", title: "Winter Special Package", description: "Cleanup, Full Hand Wax, Manicure, Threading, Forehead, Upper Lip, Head Massage - Was ₹1299", discountPercent: 54, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 45 },
  { id: "2", title: "Glow Up Package", description: "Facial, Full Hand Wax, Half Leg Wax, Manicure, Head Massage, Threading, Upper Lip, Forehead - Was ₹1699", discountPercent: 47, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 32 },
  { id: "3", title: "Complete Care Package", description: "Hair Spa, Hair Cut, Head Massage, Cleanup, Full Hand Wax, Threading, Upper Lip, Forehead - Was ₹2299", discountPercent: 48, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 28 },
];

const initialReviews: Review[] = [
  { id: "1", customerName: "Priya Sharma", customerEmail: "priya@email.com", rating: 5, comment: "Aura Bliss Salon transformed my look completely! The team is so professional and the ambiance is absolutely divine.", service: "Bridal Makeup", isApproved: true, createdAt: "2024-12-10" },
  { id: "2", customerName: "Ananya Patel", customerEmail: "ananya@email.com", rating: 5, comment: "My bridal makeup was flawless. Everyone complimented how beautiful I looked. Thank you Aura Bliss Salon!", service: "HD Bridal Makeup", isApproved: true, createdAt: "2024-12-08" },
  { id: "3", customerName: "Meera Reddy", customerEmail: "meera@email.com", rating: 5, comment: "The spa treatments here are incredibly relaxing. It's my go-to place for self-care and rejuvenation.", service: "Full Body Massage", isApproved: true, createdAt: "2024-12-05" },
  { id: "4", customerName: "Kavya Nair", customerEmail: "kavya@email.com", rating: 4, comment: "Great service and friendly staff. Will definitely come back!", service: "Korean Glass Facial", isApproved: false, createdAt: "2024-12-15" },
];

export const useAdminStore = create<AdminStore>((set, get) => ({
  bookings: [],
  services: initialServices,
  customers: initialCustomers,
  offers: initialOffers,
  reviews: initialReviews,


  fetchBookings: async () => {
    const res = await axios.get("/api/bookings", { withCredentials: true });
    set({ bookings: res.data });
  },


  addBooking: (booking) =>
    set((state) => ({
      bookings: [booking, ...state.bookings],
    })),

  updateBookingStatus: async (id: string, status: Booking["status"]) => {
    await axios.patch(
      "/api/bookings",
      { id, status },
      { withCredentials: true }
    );

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    }));
  },

  deleteBooking: async (id: string) => {
    await axios.delete("/api/bookings", {
      data: { id },
      withCredentials: true,
    });

    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    }));
  },


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

  setServices: (services) =>
    set(() => ({
      services,
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

  addReview: (review) =>
    set((state) => ({
      reviews: [
        ...state.reviews,
        { ...review, id: generateId(), createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),

  updateReview: (id, review) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)),
    })),

  deleteReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id),
    })),

  getApprovedReviews: () => get().reviews.filter((r) => r.isApproved),
}));
