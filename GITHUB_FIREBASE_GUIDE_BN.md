# GitHub + Firebase Deploy Guide

Repository:

https://github.com/01609572550/idealcoaching

## Part 1: GitHub-e File Upload

1. GitHub repo open korun:
   https://github.com/01609572550/idealcoaching

2. `Add file` button click korun.

3. `Upload files` click korun.

4. Ei folder-er sob file upload korun:

   `firebase-react-app`

5. Upload korar somoy folder-er bhitorer file gula upload korte hobe:

   - `src`
   - `public`
   - `package.json`
   - `vite.config.js`
   - `firebase.json`
   - `firestore.rules`
   - `firestore.indexes.json`
   - `.env`
   - `.firebaserc`
   - `README.md`

6. Niche `Commit changes` click korun.

## Part 2: Firebase Console Setup

Firebase Console:

https://console.firebase.google.com/

Apnar project:

`ideal-coaching-center-16f04`

### Authentication

1. `Authentication`
2. `Get started`
3. `Sign-in method`
4. `Email/Password`
5. Enable
6. Save

### Firestore Database

1. `Firestore Database`
2. `Create database`
3. `Production mode`
4. Location select
5. Create

## Part 3: First Admin Account

Firebase Console-e:

1. `Authentication`
2. `Users`
3. `Add user`
4. Email:

   `shad@ideal.local`

5. Password:

   `752002`

6. Add user

Tarpor Firestore-e admin role add korte hobe:

1. `Firestore Database`
2. `Start collection`
3. Collection ID:

   `users`

4. Document ID:

   Firebase Authentication theke Shad user-er UID copy kore paste korun.

5. Fields add korun:

   | Field | Type | Value |
   |---|---|---|
   | uid | string | same UID |
   | username | string | Shad |
   | name | string | Shad |
   | email | string | shad@ideal.local |
   | role | string | Super Admin |
   | status | string | Active |

## Part 4: Firebase Hosting Deploy

Computer-e Node.js install thakte hobe.

1. Node.js install:

   https://nodejs.org/

2. Command Prompt open korun.

3. Project folder-e jan:

   `firebase-react-app`

4. Run:

```bash
npm install
npm install -g firebase-tools
firebase login
firebase deploy
```

Deploy complete hole Firebase hosting link paben.

## Login

Website-e login:

Username:

`Shad`

Password:

`752002`

