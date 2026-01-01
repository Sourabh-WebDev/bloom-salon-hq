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
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  isActive: boolean;
}

export type ServiceInput = {
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  isActive: boolean;
};


export interface Customer {
  _id: string;
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
  _id: string;
  name: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  service?: string;
  serviceId?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  avgRating: number;
}

interface AdminStore {
  bookings: Booking[];
  services: Service[];
  customers: Customer[];
  offers: Offer[];
  reviews: Review[];
  reviewStats: ReviewStats;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (
    id: string,
    status: Booking["status"]
  ) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchServices: (query?: string) => Promise<void>;
  fetchCustomers: () => Promise<void>;
  toggleServiceActive: (id: string, isActive: boolean) => Promise<void>;
  addService: (service: ServiceInput) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceInput>) => Promise<void>;
  deleteService: (id: string) => void;
  setServices: (services: Service[]) => void;
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addOffer: (offer: Omit<Offer, "id">) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  addReview: (review: Omit<Review, "_id" | "createdAt">) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  getApprovedReviews: () => Promise<Review[]>;
  fetchReviewStats: () => Promise<void>;
  approveReview: (id: string) => Promise<void>;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample data


const initialOffers: Offer[] = [
  { id: "1", title: "Winter Special Package", description: "Cleanup, Full Hand Wax, Manicure, Threading, Forehead, Upper Lip, Head Massage - Was ₹1299", discountPercent: 54, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 45 },
  { id: "2", title: "Glow Up Package", description: "Facial, Full Hand Wax, Half Leg Wax, Manicure, Head Massage, Threading, Upper Lip, Forehead - Was ₹1699", discountPercent: 47, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 32 },
  { id: "3", title: "Complete Care Package", description: "Hair Spa, Hair Cut, Head Massage, Cleanup, Full Hand Wax, Threading, Upper Lip, Forehead - Was ₹2299", discountPercent: 48, validFrom: "2024-12-01", validTo: "2025-01-31", isActive: true, usageCount: 28 },
];


export const useAdminStore = create<AdminStore>((set, get) => ({
  bookings: [],
  services: [],
  customers: [],
  offers: initialOffers,
  reviews: [],
  reviewStats: {
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    avgRating: 0
  },

  fetchServices: async (query = "") => {
    const url = query
      ? `/api/services/search?q=${encodeURIComponent(query)}`
      : "/api/services";

    const res = await axios.get(url);

    set({ services: res.data });
  },

  fetchBookings: async () => {
    const res = await axios.get("/api/bookings", { withCredentials: true });
    set({ bookings: res.data });
  },

  fetchCustomers: async () => {
    const res = await axios.get("/api/customers", {
      withCredentials: true,
    });

    set({ customers: res.data });
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


  addService: async (service) => {
    const res = await axios.post("/api/services", service, {
      withCredentials: true,
    });

    set((state) => ({
      services: [res.data, ...state.services],
    }));
  },


  updateService: async (id, service) => {
    await axios.put(
      `/api/services?id=${id}`,
      service,
      { withCredentials: true }
    );

    set((state) => ({
      services: state.services.map((s) =>
        s._id === id ? { ...s, ...service } : s
      ),
    }));
  },


  toggleServiceActive: async (id: string, isActive: boolean) => {
    await axios.patch(
      `/api/services?id=${id}`,
      { isActive },
      { withCredentials: true }
    );

    set((state) => ({
      services: state.services.map((s) =>
        s._id === id ? { ...s, isActive } : s
      ),
    }));
  },


  deleteService: async (id: string) => {
    await axios.delete(`/api/services?id=${id}`, {
      withCredentials: true,
    });

    set((state) => ({
      services: state.services.filter((s) => s._id !== id),
    }));
  },


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
      customers: state.customers.map((c) => (c._id === id ? { ...c, ...customer } : c)),
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

  addReview: async (review: Omit<Review, "_id" | "createdAt">) => {
    const res = await axios.post("/api/reviews", {
      serviceId: review.serviceId,
      name: review.name,
      rating: review.rating,
      comment: review.comment
    }, { withCredentials: true });

    // Refresh reviews from API
    get().fetchReviewStats();
  },

  updateReview: (id, review) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r._id === id ? { ...r, ...review } : r)),
    })),

  deleteReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r._id !== id),
    })),

  getApprovedReviews: async () => {
    const res = await axios.get("/api/reviews");
    return res.data;
  },

  fetchReviewStats: async () => {
    const res = await axios.get("/api/reviews?admin=true", {
      withCredentials: true,
    });

    set({
      reviewStats: res.data.stats,
      reviews: res.data.reviews
    });
  },

  approveReview: async (id: string) => {
    await axios.patch(`/api/reviews/${id}`,
      { isApproved: true },
      { withCredentials: true }
    );

    set((state) => ({
      reviews: state.reviews.map((r) =>
        r._id === id ? { ...r, isApproved: true } : r
      ),
    }));

    // Refresh stats
    get().fetchReviewStats();
  },
}));
