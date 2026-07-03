export type Variety = {
  id: string;
  name: string;
  origin: string;
  grade: string;
  moisture: string;
  color: string;
  packing: string[];
  minOrder: string;
  description: string;
  specs: { label: string; value: string }[];
};

export type Product = {
  id: string;
  name: string;
  category: "spices" | "commodities";
  emoji: string;
  tagline: string;
  description: string;
  heroColor: string;
  hsCode: string;
  varieties: Variety[];
  certifications: string[];
  originRegions: string[];
};

export const products: Product[] = [
];

export const countries = [
  { name: "United Arab Emirates", region: "Middle East", flag: "🇦🇪" },
  { name: "Saudi Arabia", region: "Middle East", flag: "🇸🇦" },
  { name: "Qatar", region: "Middle East", flag: "🇶🇦" },
  { name: "Kuwait", region: "Middle East", flag: "🇰🇼" },
  { name: "Oman", region: "Middle East", flag: "🇴🇲" },
  { name: "Bahrain", region: "Middle East", flag: "🇧🇭" },
  { name: "United Kingdom", region: "Europe", flag: "🇬🇧" },
  { name: "Netherlands", region: "Europe", flag: "🇳🇱" },
  { name: "Germany", region: "Europe", flag: "🇩🇪" },
  { name: "France", region: "Europe", flag: "🇫🇷" },
  { name: "Spain", region: "Europe", flag: "🇪🇸" },
  { name: "United States", region: "Americas", flag: "🇺🇸" },
  { name: "Canada", region: "Americas", flag: "🇨🇦" },
  { name: "Brazil", region: "Americas", flag: "🇧🇷" },
  { name: "Nigeria", region: "Africa", flag: "🇳🇬" },
  { name: "South Africa", region: "Africa", flag: "🇿🇦" },
  { name: "Kenya", region: "Africa", flag: "🇰🇪" },
  { name: "Ethiopia", region: "Africa", flag: "🇪🇹" },
  { name: "Egypt", region: "Africa", flag: "🇪🇬" },
  { name: "Singapore", region: "Asia Pacific", flag: "🇸🇬" },
  { name: "Malaysia", region: "Asia Pacific", flag: "🇲🇾" },
  { name: "Indonesia", region: "Asia Pacific", flag: "🇮🇩" },
  { name: "Japan", region: "Asia Pacific", flag: "🇯🇵" },
  { name: "Australia", region: "Asia Pacific", flag: "🇦🇺" },
  { name: "Bangladesh", region: "South Asia", flag: "🇧🇩" },
  { name: "Sri Lanka", region: "South Asia", flag: "🇱🇰" },
  { name: "Nepal", region: "South Asia", flag: "🇳🇵" },
  { name: "China", region: "Asia Pacific", flag: "🇨🇳" },
  { name: "Vietnam", region: "Asia Pacific", flag: "🇻🇳" },
];

export const stats = [
  { value: "29+", label: "States Sourced" },
  { value: "50+", label: "Countries Served" },
  { value: "100+", label: "Products" },
  { value: "6", label: "Product Categories" },
];

export const certifications = [
  { name: "FSSAI", fullName: "Food Safety and Standards Authority of India", color: "#1E3A5F" },
  { name: "APEDA", fullName: "Agricultural & Processed Food Products Export Development Authority", color: "#1A6B3A" },
  { name: "Spices Board", fullName: "Spices Board of India — Registered Exporter", color: "#C0392B" },
  { name: "ISO 22000", fullName: "Food Safety Management System Certified", color: "#C4930A" },
];

export const contactInfo = {
  email: ["info@silasya.com", "richa.k@silasya.com", "tarun.k@silasya.com"],
  phone: ["+91 9164626957", "+91 7349498064", "+91 7004514229"],
  whatsapp: "919164626957",
  office: "89, 2nd Floor, Royal Placid Layout, HSR Layout, Bengaluru – 560102",
  warehouse: "27, Parvathi Nagar, Peenya, Bengaluru – 560058",
  website: "www.Shumitra.com",
};

export const originDots = [
  { id: "guntur", name: "Guntur", products: ["Red Chilli"], x: 42, y: 60 },
  { id: "erode", name: "Erode", products: ["Turmeric"], x: 37, y: 72 },
  { id: "wayanad", name: "Wayanad", products: ["Black Pepper", "Cardamom", "Coffee"], x: 33, y: 68 },
  { id: "unjha", name: "Unjha", products: ["Cumin", "Sesame"], x: 22, y: 42 },
  { id: "punjab", name: "Punjab", products: ["Basmati Rice"], x: 30, y: 20 },
  { id: "rajasthan", name: "Rajasthan", products: ["Coriander", "Cumin", "Pulses"], x: 28, y: 35 },
  { id: "chikmagalur", name: "Chikmagalur", products: ["Arabica Coffee"], x: 34, y: 66 },
  { id: "bihar", name: "Bihar", products: ["Makhana"], x: 48, y: 32 },
  { id: "hsr-bengaluru", name: "Bengaluru HQ", products: ["Office & Warehouse"], x: 36, y: 68 },
];
