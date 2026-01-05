# Viruthai Pongal 2026 - Functional Analysis Report

This document enables a comprehensive overview of the **Viruthai Pongal 2026** project, detailing the functional requirements, frontend features, admin capabilities, and backend integration.

## 1. Project Overview
**Event Name:** Viruthai Pongal 2026  
**Theme:** Celebrate Culture with Innovation  
**Core Activity:** AI Video Creation Contest (Reels/Shorts)  
**Target Audience:** School and College Students (Virudhunagar District)  
**Key Dates:**
- **Registration:** Jan 3 – Jan 13
- **Submission:** Jan 3 – Jan 13
- **Results:** Jan 18

---

## 2. User-Facing Features (Frontend)
**Component:** `ViruthaiPongalPage.jsx`

### A. Hero Section
- **Visuals:** Dynamic, responsive background with a vibrant "Celebrate Culture with Innovation" tagline.
- **Status Dashboard:** Three highlighted cards displaying real-time event status:
  - **Registration:** Open (Jan 3–13) - *Green Highlight*
  - **Submission:** Live (Jan 3–13) - *Blue Highlight*
  - **Results:** Upcoming (Jan 18) - *Amber Highlight*
- **Navigation:** Smooth scroll buttons for "Register Now" and "Upload Project".

### B. Registration Module
- **Dynamic Form:** Adapts based on user category selection.
  - **School Students:** Asks for `Class/Standard` (with ordinal suffixes: 1st, 2nd, etc.).
  - **College Students:** Asks for `Degree`, `Department/Major`.
- **Fields:** Participant Name, Institute Name, Email Address, Mobile Number.
- **Logic:**
  - Real-time state management.
  - Validation ensures all fields are filled.
  - Prevents duplicate registrations (handled via backend constraints).
- **Success Feedback:** Displays a modal with a unique **Registration ID** upon successful entry.

### C. Verification & Workflow
- **Rules Section:** Clearly lists participation rules (Team size, Duration, etc.).
- **Social Verification:**
  - Instructions to follow `@edukootlearn` and `@durkkasinnovations`.
  - Hashtag copying functionality.
  - **Critical Warning:** Explicit instruction to keep Instagram accounts **Public** for "Most Liked" tracking.

### D. Judging & Awards
- **Criteria Grid:**
  1.  **Traditional:** Portrayal of culture.
  2.  **Innovation:** Use of AI/Tech.
  3.  **Most Liked:** Social engagement (Instagram).
- **Awards Section (Highlighted):**
  - 🥇 **Best Innovation / Creativity** (Gold Award)
  - 🥈 **Best Storyline / Concept** (Silver Award)
  - ❤️ **Public Choice Award** (Most Liked)
- **Prizes:** Official Certificates & Scholarships detailed.

### E. Submission Module
- **Location:** Placed at the bottom of the page for logical flow.
- **Two-Step Process:**
  1.  **Email Validation:** Checks if the entered email is registered.
  2.  **Link Submission:** Accepts **Google Drive Link** and **Instagram Post Link**.
- **Error Handling:** Prevents submission if the email is not found in the registration database.

---

## 3. Admin Panel Capabilities
**Component:** `ViruthaiPongalAdmin.jsx`

### A. Dashboard Overview
- **Authentication:** Secure login (managed via `localStorage` session in the current simplified implementation).
- **Navigation:** Breadcrumb navigation to Main Dashboard.
- **Stats:** Quick counts of Total Registrations and Total Submissions.

### B. Data Management Tabs
The admin panel is divided into two primary views:

#### 1. Registrations Tab
- **Search:** Filter records by Name, Email, Institute, or Category.
- **Data Table:**
  - **ID:** Unique Registration ID.
  - **Candidate Info:** Name & Email.
  - **Category:** School (Standard) vs College (Degree - Major).
  - **Institute:** School/College Name.
  - **Contact:** Mobile Number.
  - **Date:** Registration Timestamp.
- **Submission Status:**
  - **Video Uploaded:** (Blue Badge) System automatically checks if this email exists in the submissions table.
  - **Pending Submission:** (Amber Badge) If no submission is found.

#### 2. Submissions Tab
- **Data Table:**
  - **Candidate Name:** Auto-fetched from the Registrations table based on Email ID.
  - **Institute:** Auto-fetched from Registrations.
  - **Video Link:** Direct clickable button to **Google Drive**.
  - **Instagram Link:** Direct clickable button to **Instagram Post**.
  - **Submitted At:** Timestamp of submission.

### C. Actions
- **Refresh:** One-click data refresh from Supabase.
- **Logout:** Securely clears session and redirects to login.

---

## 4. Backend & Database Integration
**Platform:** Supabase

### Tables
1.  **`viruthaipongal_registrations`**
    - Stores all user registration data.
    - Fields: `registration_no`, `full_name`, `email_id`, `mobile_number`, `category`, `standard`, `degree`, `major`, `institute_name`, `registration_date`.

2.  **`viruthaipongal_submissions`**
    - Stores project links.
    - Fields: `email_id` (Foreign Key logic), `drive_link`, `instagram_link`, `submitted_at`.

### Logic
- **Cross-Referencing:** The Admin panel automatically cross-references these two tables to show "Submission Status" in the Registration view and "Candidate Name" in the Submission view using `email_id` as the common identifier.

---

## 5. Summary of Recent Updates
- **Mobile Responsiveness:** Optimized Hero, Status Cards, and Form Layouts for mobile devices.
- **Tagline Adjustment:** Moved "Celebrate Culture with Innovation" tagline significantly higher for better visibility.
- **Date Updates:** Registration/Submission window updated to **Jan 3 – Jan 13**. Results moved to **Jan 18**.
- **Award Highlights:** Redesigned Prize section to specific Gold/Silver/Heart award cards.
- **Form Enhancements:** "Student Name" changed to "Participant Name"; Standard selection now uses ordinal (1st, 2nd) format.
