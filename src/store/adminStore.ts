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
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  getApprovedReviews: () => Review[];
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
  { id: "1", name: "Threading", category: "Threading", price: 50, duration: "15 min", description: "Eyebrow, upper lip, forehead threading", isActive: true },
  { id: "2", name: "Korean Glass Facial", category: "Facial", price: 800, duration: "45 min", description: "Korean glass skin facial treatment", isActive: true },
  { id: "3", name: "Lotus Facial", category: "Facial", price: 600, duration: "45 min", description: "Lotus herbal facial for glowing skin", isActive: true },
  { id: "4", name: "Aroma Facial", category: "Facial", price: 500, duration: "45 min", description: "Relaxing aroma facial treatment", isActive: true },
  { id: "5", name: "O+ Facial", category: "Facial", price: 700, duration: "50 min", description: "Oxygen facial for skin rejuvenation", isActive: true },
  { id: "6", name: "Hair Spa", category: "Hair", price: 400, duration: "45 min", description: "Deep conditioning hair spa treatment", isActive: true },
  { id: "7", name: "L'oreal Hair Spa", category: "Hair", price: 600, duration: "60 min", description: "Premium L'oreal hair spa treatment", isActive: true },
  { id: "8", name: "Hair Cut", category: "Hair", price: 200, duration: "30 min", description: "Professional hair cutting service", isActive: true },
  { id: "9", name: "Bridal Makeup", category: "Makeup", price: 5000, duration: "2 hrs", description: "Complete bridal makeover", isActive: true },
  { id: "10", name: "HD Bridal Makeup", category: "Makeup", price: 7000, duration: "2.5 hrs", description: "HD bridal makeup for flawless look", isActive: true },
  { id: "11", name: "Party Makeup", category: "Makeup", price: 1200, duration: "1 hr", description: "Party ready makeup", isActive: true },
  { id: "12", name: "HD Party Makeup", category: "Makeup", price: 2000, duration: "1.5 hrs", description: "HD party makeup", isActive: true },
  { id: "13", name: "Engagement Makeup", category: "Makeup", price: 4000, duration: "2 hrs", description: "Engagement ceremony makeup", isActive: true },
  { id: "14", name: "Manicure", category: "Nails", price: 300, duration: "30 min", description: "Classic manicure service", isActive: true },
  { id: "15", name: "Pedicure", category: "Nails", price: 400, duration: "40 min", description: "Classic pedicure service", isActive: true },
  { id: "16", name: "Nail Extension", category: "Nails", price: 600, duration: "1 hr", description: "Beautiful nail extensions", isActive: true },
  { id: "17", name: "Gel Polish", category: "Nails", price: 299, duration: "30 min", description: "Long-lasting gel nail polish", isActive: true },
  { id: "18", name: "Acrylic Extension", category: "Nails", price: 1299, duration: "1.5 hrs", description: "Acrylic nail extensions", isActive: true },
  { id: "19", name: "Full Hand Wax", category: "Waxing", price: 200, duration: "30 min", description: "Full hand waxing service", isActive: true },
  { id: "20", name: "Full Body Wax", category: "Waxing", price: 800, duration: "1.5 hrs", description: "Full body waxing service", isActive: true },
  { id: "21", name: "Rica Full Body Wax", category: "Waxing", price: 1200, duration: "2 hrs", description: "Premium Rica waxing", isActive: true },
  { id: "22", name: "Half Leg Wax", category: "Waxing", price: 150, duration: "20 min", description: "Half leg waxing", isActive: true },
  { id: "23", name: "Face D-Tan", category: "D-Tan", price: 200, duration: "20 min", description: "Face de-tan treatment", isActive: true },
  { id: "24", name: "Full Body D-Tan", category: "D-Tan", price: 600, duration: "1 hr", description: "Full body de-tan treatment", isActive: true },
  { id: "25", name: "Head Massage", category: "Massage", price: 200, duration: "20 min", description: "Relaxing head massage", isActive: true },
  { id: "26", name: "Full Body Massage", category: "Massage", price: 1000, duration: "1 hr", description: "Full body relaxing massage", isActive: true },
  { id: "27", name: "Cleanup", category: "Facial", price: 300, duration: "30 min", description: "Basic face cleanup", isActive: true },
];

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
  bookings: initialBookings,
  services: initialServices,
  customers: initialCustomers,
  offers: initialOffers,
  reviews: initialReviews,

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
