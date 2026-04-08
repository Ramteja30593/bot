# 🤖 Retail Intelligence Chatbot

🚀 Live Demo: https://bot-mu-inky.vercel.app

An AI-powered Retail Intelligence Chatbot for an Electronics Store that enables users to search, compare, and purchase products using natural language and voice interactions.

---

## 📌 Overview

This project is a full-stack intelligent chatbot system that simulates a real-world e-commerce assistant (similar to Amazon/Flipkart), supporting both **Customer** and **Admin** workflows.

The chatbot uses **AI (OpenAI/Gemini)** for natural language understanding and integrates with **Supabase** for authentication, database, and backend logic.

---

## 🎯 Key Features

### 👤 Customer Features

* 🔍 Product search using natural language
* 💡 Smart product recommendations
* ⚖️ Product comparison
* 🛒 Order placement via chat
* 💳 Payment flow simulation
* 📦 Order tracking
* ❤️ Wishlist support
* 🎤 Voice input support
* 🌐 Multi-language support

---

### 🛠️ Admin Features

* 📦 Product management (Add / Update products)
* 📊 Inventory monitoring
* 📑 Order management
* 📈 Sales analytics dashboard

---

## 🧠 AI Capabilities

* Context-aware conversations
* Intent detection:

  * Product Search
  * Recommendation
  * Comparison
  * Order Booking
  * Payment
  * Order Tracking
* Multi-step reasoning
* Structured responses

---

## 🏗️ Tech Stack

### 🎨 Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS

### 🔐 Backend & Database

* Supabase (Auth + Database + Edge Functions)
* PostgreSQL

### 🤖 AI Integration

* OpenAI API / Gemini API

### 🎤 Voice & Language

* MediaRecorder API
* Speech-to-Text API
* Translation API

### 🔗 Integrations

* Payment API (simulation)
* Email SMTP

### 🚀 Deployment

* Vercel

### 🧰 Tools

* GitHub
* ESLint
* PostCSS

---

## 🧱 System Architecture

* Frontend (React UI) handles user interaction
* AI Engine processes user queries and detects intent
* Supabase Edge Functions handle backend logic
* Supabase DB stores users, products, and orders
* External APIs handle voice, translation, and notifications

---

## 🔄 Application Flow

### Customer Flow

Search → Recommend → Compare → Buy → Payment → Track

### Admin Flow

Login → Dashboard → Manage Products → Monitor Inventory → Analyze Sales

---

## 🗄️ Database Schema

* **users** → user roles (admin/customer)
* **products** → product catalog
* **orders** → user purchases
* **sales** → revenue tracking

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Ramteja30593/bot.git
cd bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_or_gemini_api_key
```

### 4. Run the app

```bash
npm run dev
```

---

## 🔐 Authentication

* Supabase Auth with role-based access
* Roles:

  * Admin
  * Customer

---

## 📊 Future Enhancements

* Real payment gateway integration
* Advanced recommendation engine
* Personalized user behavior tracking
* Mobile app version
* Real-time notifications

---

## 👨‍💻 Authors

* Ram Teja
* Sandeep Kalla

---

## ⭐ Notes

This project is designed as a **production-ready AI-powered retail assistant**, focusing on real-world usability, scalability, and intelligent automation.

---

## 📬 Feedback

Feel free to raise issues or contribute to improve the project!
