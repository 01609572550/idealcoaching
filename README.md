# Ideal Coaching Center Management System

Production-ready React + Firebase coaching center management system with:

- React + Vite
- Tailwind CSS
- Framer Motion
- Firebase Auth
- Cloud Firestore
- Firebase Storage-ready structure
- Offline-first PWA
- Role-based admin panel
- Student portal
- Payments, invoices, dues, reports, results
- QR invoice verification

## Default Admin

Username: `Shad`
Password: `752002`

Firebase Auth needs an email internally, so the app maps `Shad` to:

```text
shad@ideal.local
```

## Setup

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Enable Cloud Firestore.
4. Enable Storage if you want profile/logo uploads.
5. Copy `.env.example` to `.env` and fill Firebase config.
6. Install dependencies:

```bash
npm install
```

7. Create the default admin:

```bash
set GOOGLE_APPLICATION_CREDENTIALS=service-account.json
node scripts/createDefaultAdmin.mjs
```

8. Run locally:

```bash
npm run dev
```

## Deploy Firestore Rules

```bash
firebase deploy --only firestore
```

## Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## GitHub Pages

Set the repository name in `vite.config.js` if needed, then:

```bash
GITHUB_PAGES=true npm run build
npm run deploy:pages
```

## Offline Support

The app uses:

- Firestore IndexedDB persistence
- Service worker app-shell cache
- Local offline mutation queue for payment/due entries
- Online/offline banner in the top bar

First login must happen online. After that, cached Firestore data and queued writes work offline and sync when internet returns.

## Firestore Collections

- `students`
- `payments`
- `paymentHistory`
- `dues`
- `classes`
- `batches`
- `exams`
- `results`
- `users`
- `settings`
- `notifications`
- `invoices`
- `attendanceLogs`
- `activityLogs`

## Role Permissions

Super Admin:

- Full access

Fee Collector:

- Search students
- Collect payments
- Print invoices
- Limited reports

Result Manager:

- Exams
- Results
- Merit lists

## Notes

- Bangladesh timezone is used for display helpers.
- Use Firebase Security Rules before real deployment.
- For true staff creation without changing the current browser session, use a Cloud Function or the included Admin SDK script pattern.
