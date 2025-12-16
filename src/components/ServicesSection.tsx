import { motion } from "framer-motion";
import { Scissors, Sparkles, Heart, Leaf, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Scissors,
    title: "Hair Styling",
    description: "Expert cuts, colors, and treatments for all hair types",
    price: "From ₹500",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "Facial Treatments",
    description: "Rejuvenating facials for glowing, healthy skin",
    price: "From ₹800",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: Heart,
    title: "Bridal Makeup",
    description: "Make your special day unforgettable",
    price: "From ₹5000",
    color: "from-rose-gold/20 to-rose-gold/5",
  },
  {
    icon: Leaf,
    title: "Spa & Wellness",
    description: "Relaxing massages and body treatments",
    price: "From ₹1500",
    color: "from-champagne/30 to-champagne/5",
  },
  {
    icon: Crown,
    title: "Nail Art",
    description: "Creative manicures and pedicures",
    price: "From ₹400",
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: Star,
    title: "Waxing & Threading",
    description: "Smooth, hair-free skin with gentle care",
    price: "From ₹200",
    color: "from-blush to-blush/5",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Beauty Treatments
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of premium beauty services designed to pamper you
            and bring out your natural radiance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to="/services">
                <div className={`card-elegant group hover:shadow-glow transition-all duration-500 cursor-pointer bg-gradient-to-br ${service.color}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <span className="font-semibold text-primary">{service.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
