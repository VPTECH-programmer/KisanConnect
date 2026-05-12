/* Demo data for KisanConnect prototype - Extended with trust, ratings, reviews */

const DEMO_ACCOUNTS = {
  "9876543210": { name: "Ram", role: "farmer", kycVerified: true, verificationStatus: "approved" },
  "9999999999": { name: "Shyam", role: "consumer", kycVerified: false, verificationStatus: null },
  "8888888888": { name: "Admin", role: "admin", kycVerified: true, verificationStatus: null }
};

const DEMO_OTP = "123456";

const DEMO_FARMERS = [
  {
    id: 1, name: "Ram Kumar", nameHi: "राम कुमार", mobile: "9876543210",
    village: "Barkheda", district: "Bhopal", state: "Madhya Pradesh",
    aadhaar: "1234-5678-9012", kisanId: "MP-KISAN-2024-0891", khasra: "KH-234/5",
    verificationStatus: "approved", verifiedDate: "2026-03-15",
    rating: 4.8, totalReviews: 42, trustScore: 95, deliverySuccessRate: 98,
    repeatCustomerPercent: 72, positiveReviewPercent: 95, totalOrders: 86,
    crops: ["Potato", "Onion", "Wheat"], category: "vegetables",
    avatar: "RK", joinedDate: "2025-11-20"
  },
  {
    id: 2, name: "Suresh Patel", nameHi: "सुरेश पटेल", mobile: "9876543211",
    village: "Hoshangabad", district: "Hoshangabad", state: "Madhya Pradesh",
    aadhaar: "2345-6789-0123", kisanId: "MP-KISAN-2024-1024", khasra: "KH-567/2",
    verificationStatus: "approved", verifiedDate: "2026-02-10",
    rating: 4.5, totalReviews: 28, trustScore: 88, deliverySuccessRate: 95,
    repeatCustomerPercent: 65, positiveReviewPercent: 89, totalOrders: 54,
    crops: ["Tomato", "Rice"], category: "vegetables",
    avatar: "SP", joinedDate: "2025-12-05"
  },
  {
    id: 3, name: "Mahesh Yadav", nameHi: "महेश यादव", mobile: "9876543212",
    village: "Sehore", district: "Sehore", state: "Madhya Pradesh",
    aadhaar: "3456-7890-1234", kisanId: "MP-KISAN-2025-0033", khasra: "KH-89/1",
    verificationStatus: "pending", verifiedDate: null,
    rating: 3.9, totalReviews: 12, trustScore: 62, deliverySuccessRate: 85,
    repeatCustomerPercent: 40, positiveReviewPercent: 75, totalOrders: 18,
    crops: ["Carrot", "Soyabean"], category: "vegetables",
    avatar: "MY", joinedDate: "2026-03-01"
  },
  {
    id: 4, name: "Gopal Verma", nameHi: "गोपाल वर्मा", mobile: "9123456789",
    village: "Vidisha", district: "Vidisha", state: "Madhya Pradesh",
    aadhaar: "4567-8901-2345", kisanId: "MP-KISAN-2025-0047", khasra: "KH-112/3",
    verificationStatus: "pending", verifiedDate: null,
    rating: 0, totalReviews: 0, trustScore: 25, deliverySuccessRate: 0,
    repeatCustomerPercent: 0, positiveReviewPercent: 0, totalOrders: 0,
    crops: ["Pulses", "Wheat"], category: "pulses",
    avatar: "GV", joinedDate: "2026-05-06"
  },
  {
    id: 5, name: "Lakshmi Devi", nameHi: "लक्ष्मी देवी", mobile: "9234567890",
    village: "Raisen", district: "Raisen", state: "Madhya Pradesh",
    aadhaar: "5678-9012-3456", kisanId: "MP-KISAN-2025-0058", khasra: "KH-45/7",
    verificationStatus: "pending", verifiedDate: null,
    rating: 0, totalReviews: 0, trustScore: 20, deliverySuccessRate: 0,
    repeatCustomerPercent: 0, positiveReviewPercent: 0, totalOrders: 0,
    crops: ["Soyabean", "Pulses"], category: "pulses",
    avatar: "LD", joinedDate: "2026-05-07"
  },
  {
    id: 6, name: "Ravi Singh", nameHi: "रवि सिंह", mobile: "9345678901",
    village: "Betul", district: "Betul", state: "Madhya Pradesh",
    aadhaar: "6789-0123-4567", kisanId: "MP-KISAN-2025-0062", khasra: "KH-78/9",
    verificationStatus: "rejected", verifiedDate: null, rejectionReason: "Aadhaar details mismatch",
    rating: 2.1, totalReviews: 3, trustScore: 15, deliverySuccessRate: 60,
    repeatCustomerPercent: 10, positiveReviewPercent: 33, totalOrders: 5,
    crops: ["Wheat"], category: "grains",
    avatar: "RS", joinedDate: "2026-04-15"
  }
];

const DEMO_CROPS = [
  { id: 1, name: "Potato", nameHi: "आलू", category: "vegetables", price: 25, quantity: 500, farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", verified: true, unit: "kg", image: "potato" },
  { id: 2, name: "Onion", nameHi: "प्याज़", category: "vegetables", price: 30, quantity: 300, farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", verified: true, unit: "kg", image: "onion" },
  { id: 3, name: "Wheat", nameHi: "गेहूँ", category: "grains", price: 22, quantity: 1000, farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", verified: true, unit: "kg", image: "wheat" },
  { id: 4, name: "Soyabean", nameHi: "सोयाबीन", category: "pulses", price: 40, quantity: 200, farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", verified: true, unit: "kg", image: "soyabean" },
  { id: 5, name: "Pulses", nameHi: "दाल", category: "pulses", price: 80, quantity: 150, farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", verified: true, unit: "kg", image: "pulses" },
  { id: 6, name: "Tomato", nameHi: "टमाटर", category: "vegetables", price: 35, quantity: 400, farmerId: 2, farmer: "Suresh Patel", farmerMobile: "9876543211", verified: true, unit: "kg", image: "tomato" },
  { id: 7, name: "Rice", nameHi: "चावल", category: "grains", price: 45, quantity: 800, farmerId: 2, farmer: "Suresh Patel", farmerMobile: "9876543211", verified: true, unit: "kg", image: "rice" },
  { id: 8, name: "Carrot", nameHi: "गाजर", category: "vegetables", price: 40, quantity: 250, farmerId: 3, farmer: "Mahesh Yadav", farmerMobile: "9876543212", verified: false, unit: "kg", image: "carrot" },
  { id: 9, name: "Soyabean", nameHi: "सोयाबीन", category: "pulses", price: 38, quantity: 180, farmerId: 3, farmer: "Mahesh Yadav", farmerMobile: "9876543212", verified: false, unit: "kg", image: "soyabean" },
  { id: 10, name: "Pulses", nameHi: "दाल", category: "pulses", price: 75, quantity: 100, farmerId: 4, farmer: "Gopal Verma", farmerMobile: "9123456789", verified: false, unit: "kg", image: "pulses" },
  { id: 11, name: "Wheat", nameHi: "गेहूँ", category: "grains", price: 24, quantity: 600, farmerId: 4, farmer: "Gopal Verma", farmerMobile: "9123456789", verified: false, unit: "kg", image: "wheat" },
  { id: 12, name: "Soyabean", nameHi: "सोयाबीन", category: "pulses", price: 42, quantity: 220, farmerId: 5, farmer: "Lakshmi Devi", farmerMobile: "9234567890", verified: false, unit: "kg", image: "soyabean" }
];

const GOVT_PRICE_SOURCES = {
  potato: { crop: "Potato", source: "Agmarknet mandi average", min: 18, max: 29 },
  onion: { crop: "Onion", source: "Agmarknet mandi average", min: 22, max: 36 },
  wheat: { crop: "Wheat", source: "MSP + mandi range", min: 23, max: 28 },
  soyabean: { crop: "Soyabean", source: "MSP + mandi range", min: 38, max: 47 },
  pulses: { crop: "Pulses", source: "MSP + mandi range", min: 72, max: 90 },
  tomato: { crop: "Tomato", source: "Agmarknet mandi average", min: 24, max: 42 },
  rice: { crop: "Rice", source: "MSP + mandi range", min: 34, max: 48 },
  carrot: { crop: "Carrot", source: "Agmarknet mandi average", min: 30, max: 46 }
};

const DEMAND_PREDICTIONS = [
  {
    crop: "Onion",
    demand: "High",
    confidence: 92,
    suggestedPrice: 34,
    sellWindow: "Next 7 days",
    reason: "Festival demand and repeat orders are rising."
  },
  {
    crop: "Wheat",
    demand: "Stable",
    confidence: 84,
    suggestedPrice: 25,
    sellWindow: "Hold 10-14 days",
    reason: "Market price is steady and bulk buyer trend remains consistent."
  },
  {
    crop: "Tomato",
    demand: "Rising",
    confidence: 88,
    suggestedPrice: 38,
    sellWindow: "Next 3-5 days",
    reason: "Warm weather and local retail demand can support faster sales."
  }
];

function getCropKey(name) {
  return (name || "").toLowerCase().replace(/\s+/g, "");
}

function getGovtPriceSource(name) {
  const key = getCropKey(name);
  return GOVT_PRICE_SOURCES[key] || null;
}

function getPurchaseLimits(crop) {
  if (crop.minPurchase && crop.maxPurchase) {
    return { min: crop.minPurchase, max: crop.maxPurchase };
  }
  const quantity = crop.quantity || 100;
  return {
    min: Math.max(1, Math.round(quantity * 0.05)),
    max: Math.max(5, Math.round(quantity * 0.2))
  };
}

const DEMO_REVIEWS = [
  { id: 1, farmerId: 1, consumerName: "Shyam", rating: 5, date: "2026-05-01",
    text: "Excellent quality potatoes! Very fresh and delivered on time.",
    textHi: "बहुत अच्छी गुणवत्ता के आलू! बहुत ताज़े और समय पर डिलीवर।",
    quality: 5, delivery: 5, packaging: 4, communication: 5,
    reported: false, helpful: 8 },
  { id: 2, farmerId: 1, consumerName: "Priya", rating: 5, date: "2026-04-28",
    text: "Ram ji always delivers the best produce. Highly recommended!",
    textHi: "राम जी हमेशा सबसे अच्छी उपज देते हैं। बहुत अनुशंसित!",
    quality: 5, delivery: 5, packaging: 5, communication: 4,
    reported: false, helpful: 12 },
  { id: 3, farmerId: 1, consumerName: "Amit", rating: 4, date: "2026-04-25",
    text: "Good onions, slightly smaller than expected but fresh.",
    textHi: "अच्छे प्याज, उम्मीद से थोड़े छोटे लेकिन ताज़े।",
    quality: 4, delivery: 4, packaging: 4, communication: 5,
    reported: false, helpful: 3 },
  { id: 4, farmerId: 2, consumerName: "Shyam", rating: 5, date: "2026-05-03",
    text: "Amazing tomatoes! Will order again.",
    textHi: "बहुत अच्छे टमाटर! फिर ऑर्डर करूँगा।",
    quality: 5, delivery: 4, packaging: 4, communication: 4,
    reported: false, helpful: 6 },
  { id: 5, farmerId: 2, consumerName: "Neha", rating: 4, date: "2026-04-30",
    text: "Good quality rice. Fair price.",
    textHi: "अच्छी गुणवत्ता का चावल। उचित दाम।",
    quality: 4, delivery: 5, packaging: 3, communication: 4,
    reported: false, helpful: 2 },
  { id: 6, farmerId: 3, consumerName: "Rahul", rating: 3, date: "2026-04-20",
    text: "Carrots were okay, some were damaged in transit.",
    textHi: "गाजर ठीक थी, कुछ रास्ते में खराब हो गई।",
    quality: 3, delivery: 2, packaging: 3, communication: 4,
    reported: false, helpful: 1 },
  { id: 7, farmerId: 6, consumerName: "Vikram", rating: 1, date: "2026-04-18",
    text: "Very poor quality. Not what was shown. Suspect fake listing.",
    textHi: "बहुत खराब गुणवत्ता। जो दिखाया वो नहीं मिला। नकली लिस्टिंग का शक।",
    quality: 1, delivery: 2, packaging: 1, communication: 1,
    reported: true, helpful: 5 }
];

const DEMO_ORDERS = [
  { id: "ORD001", consumer: "Shyam", consumerMobile: "9999999999", farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", crop: "Potato", quantity: 10, price: 25, total: 250, status: "delivered", date: "2026-05-01", paymentMethod: "UPI" },
  { id: "ORD002", consumer: "Shyam", consumerMobile: "9999999999", farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", crop: "Onion", quantity: 5, price: 30, total: 150, status: "in_transit", date: "2026-05-05", paymentMethod: "Wallet" },
  { id: "ORD003", consumer: "Shyam", consumerMobile: "9999999999", farmerId: 1, farmer: "Ram Kumar", farmerMobile: "9876543210", crop: "Wheat", quantity: 20, price: 22, total: 440, status: "packed", date: "2026-05-07", paymentMethod: "COD" },
  { id: "ORD004", consumer: "Shyam", consumerMobile: "9999999999", farmerId: 2, farmer: "Suresh Patel", farmerMobile: "9876543211", crop: "Tomato", quantity: 8, price: 35, total: 280, status: "delivered", date: "2026-05-03", paymentMethod: "UPI" }
];

const DEMO_PAYMENTS = [
  { id: "TXN001", orderId: "ORD001", amount: 250, method: "UPI", status: "completed", date: "2026-05-01" },
  { id: "TXN002", orderId: "ORD002", amount: 150, method: "Wallet", status: "completed", date: "2026-05-05" },
  { id: "TXN003", orderId: "ORD003", amount: 440, method: "COD", status: "pending", date: "2026-05-07" },
  { id: "TXN004", orderId: "ORD004", amount: 280, method: "UPI", status: "completed", date: "2026-05-03" }
];

const DEMO_ADMIN_STATS = {
  totalFarmers: 1247, totalConsumers: 5832, totalOrders: 18456,
  revenue: 2450000, pendingVerifications: 3, activeDisputes: 7,
  verifiedFarmers: 892, avgPlatformRating: 4.3, consumerSatisfaction: 87
};

const DEMO_VERIFICATION_QUEUE = [
  {
    id: 1, name: "Gopal Verma", nameHi: "गोपाल वर्मा", mobile: "9123456789",
    aadhaar: "4567-8901-2345", kisanId: "MP-KISAN-2025-0047", khasra: "KH-112/3",
    village: "Vidisha", district: "Vidisha", state: "Madhya Pradesh",
    status: "pending", date: "2026-05-06", step: 5,
    documents: { aadhaar: true, landProof: true, farmerPhoto: true }
  },
  {
    id: 2, name: "Lakshmi Devi", nameHi: "लक्ष्मी देवी", mobile: "9234567890",
    aadhaar: "5678-9012-3456", kisanId: "MP-KISAN-2025-0058", khasra: "KH-45/7",
    village: "Raisen", district: "Raisen", state: "Madhya Pradesh",
    status: "pending", date: "2026-05-07", step: 5,
    documents: { aadhaar: true, landProof: true, farmerPhoto: true }
  },
  {
    id: 3, name: "Ravi Singh", nameHi: "रवि सिंह", mobile: "9345678901",
    aadhaar: "6789-0123-4567", kisanId: "MP-KISAN-2025-0062", khasra: "KH-78/9",
    village: "Betul", district: "Betul", state: "Madhya Pradesh",
    status: "pending", date: "2026-05-07", step: 5,
    documents: { aadhaar: true, landProof: false, farmerPhoto: true }
  }
];

const TRACKING_STEPS = ["order_placed", "farmer_accepted", "packed", "in_transit", "delivered"];

const KYC_STEPS = [
  { key: "aadhaar", title: "Aadhaar Verification", titleHi: "आधार सत्यापन", icon: "shield" },
  { key: "kisan", title: "Kisan ID Verification", titleHi: "किसान ID सत्यापन", icon: "user" },
  { key: "land", title: "Land Details", titleHi: "भूमि विवरण", icon: "crop" },
  { key: "documents", title: "Document Upload", titleHi: "दस्तावेज़ अपलोड", icon: "package" },
  { key: "review", title: "Review & Submit", titleHi: "समीक्षा और जमा", icon: "check" }
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Bihar", "Chhattisgarh", "Gujarat", "Haryana",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal"
];
