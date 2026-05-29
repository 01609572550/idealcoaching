import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

const email = 'shad@ideal.local';
const password = '752002';

let user;
try {
  user = await auth.getUserByEmail(email);
} catch {
  user = await auth.createUser({
    email,
    password,
    displayName: 'Shad'
  });
}

await db.collection('users').doc(user.uid).set({
  uid: user.uid,
  username: 'Shad',
  name: 'Shad',
  email,
  role: 'Super Admin',
  status: 'Active',
  createdAt: new Date().toISOString()
}, { merge: true });

console.log('Default Super Admin ready:');
console.log('Username: Shad');
console.log('Password: 752002');
