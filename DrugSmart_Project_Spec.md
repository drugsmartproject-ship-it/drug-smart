
# DrugSmart – Pharmacy Management System Specification

## Overview
DrugSmart is a pharmacy management and assistive health information system designed for small-town drugstores in Ghana. The system focuses on inventory management, sales processing, drug intelligence, and basic analytics while remaining safe, practical, and compliant with non-prescriptive standards.

The system is **pharmacy-first**, with intelligence features acting strictly as decision support tools.

---

## Target Users & Roles

### 1. Owner
- Full access to all modules
- View analytics and trends
- Manage users and suppliers

### 2. Cashier
- Process sales
- View inventory (read-only)
- No access to analytics or settings

### 3. Licensed Medical Practitioner
- Access drug intelligence tools
- View clinical decision support prompts
- Cannot alter inventory or pricing

---

## Color Scheme & Visual Identity

Inspired by the provided reference image.

### Primary Colors
- **Medical Green:** `#1FA67A`
- **Teal Accent:** `#2FB9B3`

### Secondary Colors
- **Soft Blue:** `#EAF6F9`
- **Light Grey:** `#F4F6F8`

### Text Colors
- **Primary Text:** `#1F2933`
- **Secondary Text:** `#6B7280`

### UI Style
- Clean
- Minimal
- Professional medical aesthetic
- Rounded cards and soft shadows
- Mobile-first design

---

## Application Pages & UI Description

## 1. Splash Screen
**Purpose:** Brand introduction

**UI Description:**
- DrugSmart logo centered
- Gradient background (green → teal)
- Subtle loading animation

---

## 2. Login Page
**Purpose:** Authentication

**UI Description:**
- App logo at top
- Username & password fields
- Role selector (Owner / Cashier / Medical Practitioner)
- Primary green login button
- “Forgot password?” link

---

## 3. Dashboard
**Purpose:** Overview of pharmacy activity

**UI Description:**
- Top summary cards:
  - Yesterday’s sales
  - Total revenue
  - Profit estimate
- Stock overview graph by category
- Alerts section:
  - Low stock warnings
  - Drugs nearing expiry
- Clean card-based layout

---

## 4. Inventory Management
**Purpose:** Drug stock control

**UI Description:**
- Search bar at top
- Drug list table:
  - Name
  - Category
  - Quantity
  - Expiry date
  - Status indicator
- Floating “Add Drug” button
- Color-coded expiry alerts

---

## 5. Add / Edit Drug Page
**Purpose:** Manage drug records

**UI Description:**
- Form-based layout
- Fields:
  - Drug name
  - Category
  - Supplier
  - Cost price
  - Selling price
  - Quantity
  - Expiry date
- Save & cancel buttons

---

## 6. Sales Processing Page
**Purpose:** Handle transactions

**UI Description:**
- Prominent search bar
- Drug list sorted by:
  - Most purchased
  - Alphabetical order
- On drug selection:
  - Quantity selector
  - Payment method
  - Confirm sale button
- Instant feedback on successful sale

---

## 7. Sales Receipt Page
**Purpose:** Transaction confirmation

**UI Description:**
- Simple receipt layout
- Drug list
- Total amount
- Date & time
- Print / Save option

---

## 8. Drug Intelligence Page
**Purpose:** Drug verification & information

**UI Description:**
- Search input
- Drug details card:
  - Generic & brand names
  - Common uses
  - Warnings
- Disclaimer banner:
  - “For reference only. Not a prescription.”

---

## 9. Clinical Decision Support Page
**Purpose:** Assistive symptom-to-drug guidance

**UI Description:**
- Symptom input form
- Suggested drug categories
- Warning alerts (contraindications)
- Strong disclaimer emphasized visually

---

## 10. Analytics & Trends
**Purpose:** Business insights

**UI Description:**
- Sales trend charts
- Fast vs slow-moving drugs
- Category performance graphs
- Monthly & weekly filters

---

## 11. User Management (Owner Only)
**Purpose:** Control access

**UI Description:**
- User list
- Role tags
- Add / disable user buttons

---

## 12. Settings Page
**Purpose:** System configuration

**UI Description:**
- Pharmacy details
- Notification preferences
- Backup & export options

---

## Non-Functional Requirements
- Offline-first support
- Secure authentication
- Simple navigation
- Fast performance on low-end devices

---

## Compliance & Safety Notes
- No automatic prescribing
- Clear medical disclaimers
- Decision support only

---

## Future Expansion (Not V1)
- Supplier integrations
- Multi-store analytics
- Advanced AI recommendations

---

**DrugSmart – Smart Tools for Safer Pharmacies**
