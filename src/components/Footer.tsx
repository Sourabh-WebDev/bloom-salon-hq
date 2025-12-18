import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Aura Bliss Salon Logo" className="w-12 h-12 rounded-full object-cover" />
              <span className="font-display text-2xl font-semibold text-foreground">
                Aura Bliss Salon
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Your destination for luxury beauty treatments and premium salon services.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/aura_bliss_salon_?igsh=MWtybG5qdDFzejVtaw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Services", "About", "Gallery", "Contact", "Booking"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {["Facial", "Hair Spa", "Bridal Makeup", "Manicure & Pedicure", "Waxing", "Threading"].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Rajendra Nagar, Near Gauriya Math, Lucknow
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="w-5 h-5 text-primary" />
                <div className="text-muted-foreground">
                  <div>6306532040</div>
                  <div>8874573050</div>
                  <div>7985666898</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">aurablisssalon@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>© 2024 Aura Bliss Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
