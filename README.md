# 🍱 Gourmet Hub - Fullstack Catering Solution

> **A premium, hybrid B2B & B2C platform designed for high-performance catering operations and logistics.**

**Gourmet Hub** is a state-of-the-art catering management system built to handle the complexities of institutional catering (offices/instansi) and public demand. It focuses on a **Mobile-First** experience, **Rich Aesthetics**, and **Atomic Reliability**.

---

## 🚀 Strategic Tech Stack

This project leverages the bleeding edge of web development to ensure scalability, security, and developer productivity.

### ⚡ **Frontend: Svelte 5 (Next-Gen Reactivity)**
- **Runes Architecture**: Utilizing `$state`, `$derived`, and `$props` for fine-grained reactivity, leading to ultra-small bundles and blazing-fast performance.
- **Vibrant Gourmet UI**: A custom design system built with **Tailwind CSS 4**, featuring glassmorphism, smooth micro-interactions, and high visual density.

### ⚙️ **Backend: SvelteKit & Drizzle ORM**
- **Type-Safe Persistence**: Powered by **Drizzle ORM** and **PostgreSQL**, ensuring database integrity with a relational schema and atomic transactions.
- **Business Logic**: Robust server loaders and actions that bridge the gap between complex SQL and reactive UI.

### 🛡️ **Security: Auth.js & RBAC**
- **Identity Management**: Secure authentication via **Auth.js** (formerly NextAuth) with a JWT-based strategy and HttpOnly cookie enforcement.
- **Role-Based Access Control (RBAC)**: A strict multi-layered guard system (Middleware + Server Hooks) ensuring Admin, CS, and Users only access their respective domains.

---

## 🏗️ Technical Architecture

### **Domain-Driven Design (DDD)**
The system is architected into specific modules for specialized operations:
- **Portal (Public)**: High-SEO landing page and self-registration funnel.
- **Customer Hub (User)**: Daily catalog browsing, persistent cart, and branded receipt generation.
- **Operational Center (CS)**: Real-time order mutation, status tracking, and kitchen logistics.
- **Governance Suite (Admin)**: Financial oversight, RBAC management, and system-wide audits.

### **System Workflow**
```mermaid
graph LR
    A[Visitor] -->|Register| B{Role Guard}
    B -->|User| C[Customer Dash]
    B -->|Staff| D[CS Dashboard]
    B -->|Owner| E[Admin Dashboard]
    C -->|Order| F((Database))
    D -->|Update| F
    E -->|Analyze| F
```

---

## 💎 Key Technical Features

- **Branded PDF Engine**: High-fidelity 80mm thermal receipt generator using **jsPDF** and **jspdf-autotable**. 
- **Atomic Stock Management**: (In Progress) Ensuring inventory consistency across concurrent user orders.
- **Relational Snapshots**: Preserving price and product data at the moment of order to ensure financial audit integrity.
- **Gourmet UX**: Custom iconography (Lucide) and premium typography (Inter) for a high-end enterprise feel.

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 20+
- Docker & Docker Compose (for PostgreSQL)

### **1. Clone & Install**
```bash
git clone <repository-url>
cd catering-fullstack
npm install
```

### **2. Infrastructure (Docker)**
Spin up the database and pgAdmin:
```bash
docker-compose up -d
```

### **3. Environment Config**
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgres://admin:admin_password@localhost:5432/catering_db"
AUTH_SECRET="your-32-char-secret"
```

### **4. Database Sync**
```bash
npx drizzle-kit push
```

### **5. Run Development**
```bash
npm run dev
```

---

## 👨‍💻 Portfolio Reference
*This project is part of a larger ecosystem managed by the **Brain & Muscles** philosophy. For full system documentation (Master Kanban, SOPs, and Modular Brain), please refer to the [Root Repository](../README.md).*

---
*Developed with technical precision and design excellence.*
