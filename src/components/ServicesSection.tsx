import { motion } from "framer-motion";
import { FaCut, FaStar, FaHeart, FaLeaf, FaCrown } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { Link } from "react-router-dom";

const services = [
  {
    icon: GiSparkles,
    title: "Facial Treatments",
    description: "Korean Glass Facial, Lotus Facial, O+ Facial, Aroma Facial & more",
    price: "From ₹499",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: FaHeart,
    title: "Bridal & Party Makeup",
    description: "HD Bridal, Engagement, Party Makeup by expert artists",
    price: "From ₹1200",
    color: "from-rose-gold/20 to-rose-gold/5",
  },
  {
    icon: FaCut,
    title: "Hair Services",
    description: "Hair Spa, Hair Cut, Hair Wash, L'oreal Treatments",
    price: "From ₹200",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: FaLeaf,
    title: "Body Spa & Massage",
    description: "Full Body Massage, Head Massage, Relaxing treatments",
    price: "From ₹500",
    color: "from-champagne/30 to-champagne/5",
  },
  {
    icon: FaCrown,
    title: "Nail Art",
    description: "Nail Extension, Gel Polish, Acrylic Extension, Manicure & Pedicure",
    price: "From ₹299",
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: FaStar,
    title: "Waxing & Threading",
    description: "Full Body Wax, Rica Wax, D-Tan, Threading, Upper Lip, Forehead",
    price: "From ₹50",
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
            Discover our range of premium beauty services at Aura Bliss Salon designed to pamper you
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
                <div className={`card-elegant group hover:shadow-glow transition-all duration-500 cursor-pointer bg-gradient-to-br h-full flex flex-col ${service.color}`}>
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
