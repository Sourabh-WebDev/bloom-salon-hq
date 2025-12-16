import { motion } from "framer-motion";
import { Scissors, Sparkles, Heart, Leaf, Crown, Star, Clock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allServices = [
  {
    icon: Scissors,
    title: "Hair Services",
    items: [
      { name: "Hair Cut & Styling", price: 500, duration: "45 min" },
      { name: "Hair Coloring", price: 1500, duration: "2 hrs" },
      { name: "Hair Spa Treatment", price: 1200, duration: "1 hr" },
      { name: "Keratin Treatment", price: 3500, duration: "3 hrs" },
      { name: "Hair Straightening", price: 2500, duration: "2.5 hrs" },
    ],
  },
  {
    icon: Sparkles,
    title: "Facial Treatments",
    items: [
      { name: "Classic Facial", price: 800, duration: "45 min" },
      { name: "Gold Facial", price: 1500, duration: "1 hr" },
      { name: "Anti-Aging Facial", price: 2000, duration: "1.5 hrs" },
      { name: "Hydra Facial", price: 2500, duration: "1 hr" },
      { name: "Acne Treatment", price: 1200, duration: "45 min" },
    ],
  },
  {
    icon: Heart,
    title: "Bridal Services",
    items: [
      { name: "Bridal Makeup", price: 5000, duration: "2 hrs" },
      { name: "Engagement Makeup", price: 3000, duration: "1.5 hrs" },
      { name: "Pre-Bridal Package", price: 8000, duration: "Full day" },
      { name: "Bridal Mehndi", price: 2000, duration: "3 hrs" },
      { name: "Family Package", price: 4000, duration: "3 hrs" },
    ],
  },
  {
    icon: Leaf,
    title: "Spa & Wellness",
    items: [
      { name: "Swedish Massage", price: 1500, duration: "1 hr" },
      { name: "Aromatherapy", price: 1800, duration: "1.5 hrs" },
      { name: "Hot Stone Therapy", price: 2200, duration: "1.5 hrs" },
      { name: "Body Scrub", price: 1200, duration: "45 min" },
      { name: "Full Body Spa", price: 3500, duration: "3 hrs" },
    ],
  },
  {
    icon: Crown,
    title: "Nail Services",
    items: [
      { name: "Classic Manicure", price: 400, duration: "30 min" },
      { name: "Gel Manicure", price: 800, duration: "45 min" },
      { name: "Nail Art", price: 600, duration: "1 hr" },
      { name: "Classic Pedicure", price: 500, duration: "45 min" },
      { name: "Spa Pedicure", price: 900, duration: "1 hr" },
    ],
  },
  {
    icon: Star,
    title: "Hair Removal",
    items: [
      { name: "Full Body Waxing", price: 1500, duration: "1.5 hrs" },
      { name: "Half Legs Waxing", price: 300, duration: "20 min" },
      { name: "Full Arms Waxing", price: 400, duration: "30 min" },
      { name: "Eyebrow Threading", price: 50, duration: "10 min" },
      { name: "Upper Lip Threading", price: 30, duration: "5 min" },
    ],
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Premium Beauty Services
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of beauty and wellness services designed to make you look and feel your best.
            </p>
          </motion.div>

          <div className="space-y-12">
            {allServices.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="card-elegant"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {category.title}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-4 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <Check className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-primary text-lg">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link to="/booking">
              <Button size="lg" className="btn-primary rounded-full px-12 py-6 text-lg shadow-glow">
                Book Your Service
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
