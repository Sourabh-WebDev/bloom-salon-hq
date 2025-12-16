import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "Winter Special Package",
    originalPrice: 1299,
    offerPrice: 599,
    services: ["Cleanup", "Full Hand Wax", "Manicure", "Threading", "Forehead", "Upper Lip", "Head Massage"],
  },
  {
    title: "Glow Up Package",
    originalPrice: 1699,
    offerPrice: 899,
    services: ["Facial", "Full Hand Wax", "Half Leg Wax", "Manicure", "Head Massage", "Threading", "Upper Lip", "Forehead"],
  },
  {
    title: "Complete Care Package",
    originalPrice: 2299,
    offerPrice: 1199,
    services: ["Hair Spa", "Hair Cut", "Head Massage", "Cleanup", "Full Hand Wax", "Threading", "Upper Lip", "Forehead"],
  },
];

const OffersSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-card to-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Gift className="w-4 h-4" />
            Limited Time Offers
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Special Packages
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our exclusive limited-time offers and save big on premium beauty treatments!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="card-elegant group hover:shadow-glow transition-all duration-500 h-full flex flex-col">
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100)}% OFF
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {offer.title}
                </h3>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">₹{offer.offerPrice}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{offer.originalPrice}</span>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {offer.services.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {service}
                    </li>
                  ))}
                </ul>
                
                <Link to="/booking" className="mt-auto">
                  <Button className="w-full btn-primary rounded-full">
                    Book This Package
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
