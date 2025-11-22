import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  el: {
    // Header
    'nav.home': 'Αρχική',
    'nav.contact': 'Επικοινωνία',
    'nav.info': 'Πληροφορίες',
    'nav.cart': 'Cart',
    
    // Home Page
    'home.title': 'Καλωσήρθατε στο Gorgonstone',
    'home.subtitle': 'Τα t-shirts μας εμπνέονται από την αρχαία ελληνική μυθολογία',
    'home.products': 'Προϊόντα',
    'home.addToCart': 'Προσθήκη στο Καλάθι',
    'home.sizeLabel': 'Μέγεθος:',
    
    // Cart Page
    'cart.title': 'Το Καλάθι σας',
    'cart.empty': 'Το καλάθι σας είναι άδειο',
    'cart.continueShopping': 'Συνεχίστε τις Αγορές',
    'cart.size': 'Μέγεθος',
    'cart.quantity': 'Ποσότητα',
    'cart.price': 'Τιμή',
    'cart.total': 'Σύνολο',
    'cart.continuePurchase': 'Συνέχεια με την Αγορά',
    'cart.processing': 'Επεξεργασία...',
    
    // Success Page
    'success.title': 'Η Παραγγελία σας Ολοκληρώθηκε!',
    'success.thanks': 'Ευχαριστούμε για την αγορά σας! 🎉',
    'success.emailConfirm': 'Θα λάβετε email επιβεβαίωσης σύντομα με τις λεπτομέρειες της παραγγελίας σας.',
    'success.orderId': 'Order ID',
    'success.message': 'Το Gorgonstone σας ευχαριστεί που επιλέξατε τα προϊόντα μας. Κάθε t-shirt είναι φτιαγμένο με αγάπη και εμπνευσμένο από την αρχαία ελληνική μυθολογία.',
    'success.continueShopping': 'Συνέχεια Αγορών',
    
    // Contact Page
    'contact.title': 'Επικοινωνήστε μαζί μας',
    'contact.description': 'Έχετε ερωτήσεις; Θα χαρούμε να σας βοηθήσουμε!',
    'contact.email': 'Email',
    'contact.phone': 'Τηλέφωνο',
    'contact.address': 'Διεύθυνση',
    'contact.formTitle': 'Στείλτε μας Μήνυμα',
    'contact.name': 'Όνομα',
    'contact.emailLabel': 'Email',
    'contact.message': 'Μήνυμα',
    'contact.send': 'Αποστολή',
    'contact.responseTime': 'Συνήθως απαντάμε εντός 24-48 ωρών',
    
    // Info Page
    'info.title': 'Σχετικά με το Gorgonstone',
    'info.subtitle': 'Όπου η μυθολογία συναντά τη μόδα',
    'info.story': 'Η Ιστορία μας',
    'info.storyText': 'Το Gorgonstone γεννήθηκε από το πάθος για την αρχαία ελληνική μυθολογία και την τέχνη. Κάθε σχέδιό μας εμπνέεται από τον μύθο του Περσέα και της Μέδουσας, φέρνοντας την αρχαία ιστορία στο σύγχρονο streetwear.',
    'info.quality': 'Ποιότητα',
    'info.qualityText': 'Χρησιμοποιούμε μόνο premium υλικά και τεχνικές εκτύπωσης για να διασφαλίσουμε ότι κάθε κομμάτι είναι ανθεκτικό και άνετο.',
    'info.mission': 'Η Αποστολή μας',
    'info.missionText': 'Να κρατήσουμε ζωντανή την ελληνική μυθολογία μέσα από τη μόδα, δημιουργώντας κομμάτια που λένε μια ιστορία.',
    
    // Footer
    'footer.copyright': '© 2024 Gorgonstone. Όλα τα δικαιώματα κατοχυρωμένα.',
    'footer.privacyPolicy': 'Πολιτική Απορρήτου',
    'footer.termsOfService': 'Όροι Χρήσης',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.contact': 'Contact',
    'nav.info': 'Info',
    'nav.cart': 'Cart',
    
    // Home Page
    'home.title': 'Welcome to Gorgonstone',
    'home.subtitle': 'Our t-shirts are inspired by ancient Greek mythology',
    'home.products': 'Products',
    'home.addToCart': 'Add to Cart',
    'home.sizeLabel': 'Size:',
    
    // Cart Page
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.size': 'Size',
    'cart.quantity': 'Quantity',
    'cart.price': 'Price',
    'cart.total': 'Total',
    'cart.continuePurchase': 'Continue with Purchase',
    'cart.processing': 'Processing...',
    
    // Success Page
    'success.title': 'Order Completed Successfully!',
    'success.thanks': 'Thank you for your purchase! 🎉',
    'success.emailConfirm': 'You will receive a confirmation email shortly with your order details.',
    'success.orderId': 'Order ID',
    'success.message': 'Gorgonstone thanks you for choosing our products. Each t-shirt is crafted with love and inspired by ancient Greek mythology.',
    'success.continueShopping': 'Continue Shopping',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.description': 'Have questions? We\'d love to help!',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.formTitle': 'Send Us a Message',
    'contact.name': 'Name',
    'contact.emailLabel': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    
    // Info Page
    'info.title': 'About Gorgonstone',
    'info.subtitle': 'Where mythology meets fashion',
    'info.story': 'Our Story',
    'info.storyText': 'Gorgonstone was born from a passion for ancient Greek mythology and art. Each design is inspired by the myth of Perseus and Medusa, bringing ancient history into modern streetwear.',
    'info.quality': 'Quality',
    'info.qualityText': 'We only use premium materials and printing techniques to ensure each piece is durable and comfortable.',
    'info.mission': 'Our Mission',
    'info.missionText': 'To keep Greek mythology alive through fashion, creating pieces that tell a story.',
    
    // Footer
    'footer.copyright': '© 2024 Gorgonstone. All rights reserved.',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('gorgonstone-language');
    return (saved as Language) || 'el';
  });

  useEffect(() => {
    localStorage.setItem('gorgonstone-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'el' ? 'en' : 'el'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}