// Configuration des contacts de Teranga Foncier
export const CONTACT_INFO = {
  // Informations principales
  company: "Teranga Foncier",
  tagline: "La plateforme #1 pour l'immobilier sénégalais",
  
  // CEO & Founder
  ceo: {
    name: "Abdoulaye Diémé",
    title: "CEO & Fondateur",
    email: "palaye122@gmail.com",
    phone: "+221 77 593 42 41",
    whatsapp: "+221 77 593 42 41",
    linkedin: "https://linkedin.com/in/abdoulaye-dieme"
  },

  // Contacts principaux
  primary: {
    phone: "+221 77 593 42 41",
    whatsapp: "+221 77 593 42 41",
    email: "contact@terangafoncier.com",
    support: "support@terangafoncier.com"
  },

  // Adresse
  address: {
    street: "Avenue Cheikh Anta Diop",
    city: "Dakar",
    country: "Sénégal",
    full: "Avenue Cheikh Anta Diop, Dakar, Sénégal"
  },

  // Réseaux sociaux
  social: {
    facebook: "https://facebook.com/terangafoncier",
    twitter: "https://twitter.com/terangafoncier",
    instagram: "https://instagram.com/terangafoncier", 
    linkedin: "https://linkedin.com/company/teranga-foncier",
    youtube: "https://youtube.com/@terangafoncier"
  },

  // Horaires
  hours: {
    weekdays: "Lundi - Vendredi : 8h - 22h",
    weekend: "Samedi - Dimanche : 9h - 20h",
    support: "Support 24/7 disponible"
  },

  // Support technique
  support: {
    phone: "+221 77 593 42 41",
    email: "support@terangafoncier.com", 
    whatsapp: "+221 77 593 42 41",
    response_time: "Réponse sous 24h garantie"
  }
};

// Helpers pour formater les contacts
export const formatPhone = (phone) => phone.replace(/(\+221)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
export const getWhatsAppLink = (phone, message = "") => `https://wa.me/${phone.replace(/[\s\-\+]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
export const getCallLink = (phone) => `tel:${phone.replace(/[\s\-]/g, '')}`;
export const getEmailLink = (email, subject = "") => `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
