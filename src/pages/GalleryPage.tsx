import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import staff images
import staff1 from "@/assets/staff/WhatsApp Image 2025-12-16 at 15.32.55 copy 2.jpeg";
import staff2 from "@/assets/staff/WhatsApp Image 2025-12-16 at 15.35.31 (1) copy 2.jpeg";
import staff3 from "@/assets/staff/WhatsApp Image 2025-12-16 at 15.35.31 copy 2.jpeg";

// Import gallery images
import gallery1 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.29.jpeg";
import gallery2 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.34.jpeg";
import gallery3 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.36.jpeg";
import gallery4 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.39 (1).jpeg";
import gallery5 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.39.jpeg";
import gallery6 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.47.42.jpeg";
import gallery7 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.55 (1).jpeg";
import gallery8 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.55 (2).jpeg";
import gallery9 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.55.jpeg";
import gallery10 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.56 (1).jpeg";
import gallery11 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.56.jpeg";
import gallery12 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.57 (1).jpeg";
import gallery13 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.57.jpeg";
import gallery14 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.58 (1).jpeg";
import gallery15 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 14.58.58.jpeg";
import gallery16 from "@/assets/Gallery/WhatsApp Image 2025-12-16 at 15.00.06.jpeg";

const staffMembers = [
  { image: staff1, name: "Divya kashyap", title: "Co-Founder & Lead Artist" },
  { image: staff2, name: "Aakanksha sharma", title: "Co-Founder & Makeup Artist" },
  { image: staff3, name: "Sakshi kashyap", title: "Senior Makeup Artist" },
];

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10, gallery11, gallery12, gallery13, gallery14, gallery15];

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Golden Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full opacity-30"
          animate={{
            y: [-20, -100],
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      <Navbar />

      <main className="pt-20">
        {/* Staff Section */}
        <section className="py-16 bg-gradient-blush">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Our Expert Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet our talented co-founders and makeup artists
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {staffMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block">
                    <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 text-accent z-10" />
                    <div className="relative overflow-hidden rounded-2xl border-4 border-accent shadow-glow">
                      <img
                        src={member.image}
                        alt={member.title}
                        className="w-64 h-80 object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-4">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {member.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Our Work Gallery
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our beautiful transformations and salon atmosphere
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-xl shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>

            {/* Full width gallery16 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mt-8 overflow-hidden rounded-xl shadow-card hover:shadow-glow transition-all duration-300"
            >
              <img
                src={gallery16}
                alt="Gallery 16"
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;