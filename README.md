# 🎫 EventPass

EventPass is a QR Code Based Event Management and Attendance Tracking System developed with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**.

The project allows users to register for events, receive QR-code tickets, and check in by scanning the QR code. It also provides separate dashboards for Admin and Super Admin roles.

---

## 🚀 Features

### 👤 User

- User registration and login
- Secure password hashing
- Browse available events
- Event details page
- Join events
- QR Code ticket generation
- My Tickets page
- Profile page
- Update profile information
- Change password
- Ticket status filter (All / Attended / Not Attended)

---

### 🛠️ Admin

- Admin dashboard
- Create events
- Edit events
- Delete events
- View participants
- QR Code check-in
- Manual attendance check
- Search events
- Filter events
  - Upcoming Events
  - Past Events
- Capacity management
- Registration count display
- Prevent editing past events

---

### 👑 Super Admin

- Review admin applications
- Approve applications
- Reject applications
- Application status filtering
  - Pending
  - Approved
  - Rejected

---

## 📱 Responsive Design

The application is fully responsive.

- Desktop support
- Tablet support
- Mobile support
- Mobile navigation drawer (Hamburger Menu)

---

## 🔐 Security

- Password hashing
- Role-based authorization
- Protected admin routes
- Protected super admin routes
- Server-side validation
- Capacity validation
- Duplicate registration prevention

---

## 🧰 Technologies

- Next.js (App Router)
- React
- TypeScript
- Ant Design
- Prisma ORM
- PostgreSQL
- Docker
- QR Code
- HTML5
- CSS3

---

## 📂 Project Structure

```text
src/
│
├── app/
│   ├── api/
│   ├── admin/
│   ├── events/
│   ├── login/
│   ├── register/
│   ├── my-tickets/
│   ├── profile/
│   └── super-admin/
│
├── components/
│
├── lib/
│
└── prisma/
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/USERNAME/eventpass.git
```

Install dependencies

```bash
npm install
```

Configure environment variables

```env
DATABASE_URL="your_database_url"
```

Run database migrations

```bash
npx prisma migrate dev
```

Seed sample data

```bash
npx prisma db seed
```

Start the project

```bash
npm run dev
```

---

## 📸 Main Modules

- Home Page
- Authentication
- Event Listing
- Event Details
- My Tickets
- Profile
- Admin Dashboard
- Event Management
- QR Check-in
- Super Admin Dashboard

---

## 🎯 Future Improvements

- Progressive Web App (PWA)
- Email verification
- Password reset
- Notifications
- Event categories
- Calendar integration
- Analytics dashboard
- Export participant list (Excel / PDF)

---

## 👨‍💻 Developer

**Mert Özkan**

Computer Engineering Student

---

## 📄 License

This project was developed for educational purposes.
