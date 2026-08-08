# One-time setup

Do this once. After it's done, you'll have a real public link for your
students, and future updates just mean editing a file on GitHub's website.

## Part 1 - Create a Firebase project (the database)

1. Go to https://console.firebase.google.com and sign in with any Google
   account (a personal Gmail account is fine).
2. Click **Add project**. Name it anything (e.g. "csa-practice"). You can
   turn off Google Analytics when asked -- you don't need it.
3. Once the project is created, click the **Build > Firestore Database**
   link in the left sidebar.
4. Click **Create database**. Choose **Start in test mode** (we will lock
   this down properly below). Pick any location close to you.
5. Now click the gear icon (top left, next to "Project Overview") ->
   **Project settings**.
6. Scroll down to **Your apps**. Click the **</>** (web) icon to register
   a new web app. Give it any nickname. You do NOT need Firebase Hosting.
7. Firebase will show you a code block that includes a `firebaseConfig`
   object with values like `apiKey`, `authDomain`, `projectId`, etc.
   **Copy those values** -- you'll paste them into `src/firebase.js` in
   Part 3 below.

### Lock down the database (important)

By default "test mode" allows anyone to read/write for 30 days and then
locks everyone out. Replace it with rules that keep it open long-term but
scoped to just this app's two data types:

1. In Firestore, click the **Rules** tab.
2. Replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rosters/{docId} {
      allow read, write: if true;
    }
    match /students/{docId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**.

Heads up: these rules mean anyone who found your database's web address
directly could technically read or write this data -- there's no real
server-side authentication here (same honest limitation as before: the
4-digit PINs are a classroom-appropriate speed bump, not bank-grade
security). This is a reasonable trade-off for classroom use, but don't
store anything more sensitive than first-name-last-initial and practice
data here.

## Part 2 - Create the GitHub repository

1. Go to https://github.com and create a free account if you don't have
   one.
2. Click the **+** in the top right -> **New repository**.
3. Name it `csa-practice` (matches the `base` path already set in
   `vite.config.js` -- if you name it something else, edit that file's
   `base: '/csa-practice/'` line to match).
4. Make it **Public** (required for free GitHub Pages).
5. Click **Create repository**.
6. On the new repo's page, click **uploading an existing file** and drag
   in every file and folder from this project (everything except the
   `node_modules` and `dist` folders, which don't need to be uploaded).
   Commit the upload.

## Part 3 - Add your Firebase config

1. In your new GitHub repo, open `src/firebase.js`.
2. Click the pencil (edit) icon.
3. Replace the placeholder values with the real ones you copied from
   Firebase in Part 1.
4. Commit the change directly to the `main` branch.

## Part 4 - Turn on GitHub Pages

1. In your repo, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. That's it -- committing the firebase.js change in Part 3 will have
   already triggered the workflow in `.github/workflows/deploy.yml` to
   build and deploy automatically. Check the **Actions** tab to watch it
   run (takes about a minute).
4. Once it finishes, your site is live at:
   `https://YOUR-GITHUB-USERNAME.github.io/csa-practice/`

That link is what you give to students. Bookmark it, post it in Google
Classroom, or make a QR code for it.

## Making future updates

Whenever you want a change:

1. I'll give you the updated file content.
2. Open that file in your GitHub repo, click the pencil (edit) icon.
3. Select all, paste in the new content, and commit directly to `main`.
4. The Actions workflow rebuilds and redeploys automatically within a
   minute or two -- no other steps needed.
