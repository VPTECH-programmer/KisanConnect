# KisanConnect - Direct Farmer-to-Consumer Digital Marketplace

> BGI Hackathon 2026 | Problem Statement BT3P2

A bilingual (English/Hindi) AgriTech marketplace prototype connecting farmers directly with consumers, eliminating middlemen and ensuring fair prices.

## Folder Structure

```
KisanConnect/
├── index.html          # Landing page
├── login.html          # Mobile + OTP login
├── farmer.html         # Farmer dashboard
├── consumer.html       # Consumer marketplace
├── admin.html          # Admin dashboard
├── kyc.html            # Multi-step farmer verification
├── tracking.html       # Order logistics tracking
├── payment.html        # Payment methods
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── app.js          # Core: language, TTS, stars, trust utilities
│   ├── auth.js          # Login/OTP logic
│   ├── farmer.js       # Farmer dashboard with trust & ratings
│   ├── consumer.js     # Consumer marketplace with reviews
│   ├── admin.js        # Admin dashboard with verification workflow
│   ├── kyc.js          # 5-step KYC verification logic
│   ├── tracking.js     # Logistics tracking logic
│   └── payment.js      # Payment flow logic
├── data/
│   ├── translations.js # Bilingual text strings
│   └── demo.js         # Demo farmers, crops, reviews, orders
├── assets/
│   ├── svg/            # SVG illustrations
│   └── images/         # Image assets
└── README.md
```

## Setup

1. Open `index.html` in a modern browser (Chrome recommended for SpeechSynthesis)
2. No server required - fully frontend prototype
3. All data stored in localStorage

## Demo Accounts

| Role    | Name  | Mobile       | OTP    |
|---------|-------|--------------|--------|
| Farmer  | Ram   | 9876543210   | 123456 |
| Consumer| Shyam | 9999999999   | 123456 |
| Admin   | -     | 8888888888   | 123456 |

## Demo Farmers

| Name           | Rating | Trust Score | Status   | Crops              |
|----------------|--------|-------------|----------|--------------------|
| Ram Kumar      | 4.8    | 95%         | Approved | Potato, Onion, Wheat |
| Suresh Patel   | 4.5    | 88%         | Approved | Tomato, Rice       |
| Mahesh Yadav   | 3.9    | 62%         | Pending  | Carrot, Soyabean   |
| Gopal Verma    | -      | 25%         | Pending  | Pulses, Wheat      |
| Lakshmi Devi   | -      | 20%         | Pending  | Soyabean, Pulses   |
| Ravi Singh     | 2.1    | 15%         | Rejected | Wheat              |

## Features

### Core
- **Bilingual UI**: Full English/Hindi toggle with persistent selection
- **Voice Assistant**: Text-to-speech guidance in selected language
- **Mobile + OTP Login**: Demo OTP = 123456
- **Responsive Design**: Mobile-first with sidebar + bottom nav

### Farmer Verification (5-Step KYC)
1. Aadhaar number + OTP verification
2. Kisan ID input + simulated fetch
3. Land details (Khasra, Village, District, State)
4. Document upload simulation (Aadhaar, Land Proof, Photo)
5. Review & submit for admin verification

### Admin Verification Workflow
- Pending / Approved / Rejected tabs
- Farmer detail cards with Aadhaar, Kisan ID, Khasra
- Document preview thumbnails
- "Verify via MP Bhulekh Portal" with animated loader
- Approve / Reject / Request Re-upload actions
- Bhulekh cross-check note in UI

### Trust, Rating & Review System
- 1-5 star ratings with animated interactive stars
- Category ratings: Quality, Delivery, Packaging, Communication
- Written reviews with helpful votes
- Trust score progress bars (color-coded)
- Farmer profile cards with rating, trust, delivery success, repeat customers
- Marketplace sections: Top Rated, Most Trusted, Recently Verified
- Review moderation in admin (spam alerts, reported reviews)

### Dashboards
- **Farmer**: Trust score, rating display, reviews, verification timeline
- **Consumer**: Browse, search, filter, cart, favorites, farmer profiles, write reviews
- **Admin**: Analytics, verification workflow, review moderation, trust analytics charts

### Payment & Tracking
- UPI, Wallet, COD, Bank Transfer with success animation
- 5-step animated order tracker with simulate button

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- localStorage for state persistence
- Web Speech API for voice assistance
- No frameworks, no backend
