# Cloud-Computing Basics

An introductory cloud-computing course project for CS-6460 Educational Technology at Georgia Tech. The site is built with HTML, CSS, JavaScript, and it has no build step. Firebase Authentication handles sign-in, and Cloud Firestore stores learner progress.

## Use the hosted course

Open the GitHub Pages link, create an account with your email address, and sign in. After account creation, Firebase signs you in automatically and the site opens your dashboard.

Each learner can read and update only their own progress. Do not share your password. Course records can include quiz answers, scores, and written reflections.

## Set up Firebase for your own copy

If you only want to use the hosted course, you do not need to create a Firebase project. If you are hosting your own copy and want its sign-in and saved progress to work, create and configure a Firebase project:

1. In the [Firebase console](https://console.firebase.google.com/), create a project.
2. Go to **Build → Authentication → Get started → Sign-in method** and enable **Email/Password**.
3. Go to **Build → Firestore Database → Create database**. Choose production mode and a region suitable for your users.
4. In **Firestore Database → Rules**, publish the rules from [`firestore.rules`](./firestore.rules). The rules restrict learner records to their owners and allow only explicitly enabled admins to read all learner records.
5. Go to **Project settings → Your apps**, register a Web app, and copy its Firebase web configuration into [`firebase-config.js`](./firebase-config.js), replacing the example project's configuration.
6. In **Authentication → Settings → Authorized domains**, add `localhost` for local testing and `YOUR-GITHUB-USERNAME.github.io` for GitHub Pages. Add only the domains where you will host the site.

The Firebase web configuration identifies the web app and is expected to be present in browser code. Never put service-account credentials, private keys, or user passwords in this repository. Firestore rules are essential: do not make the database publicly readable or writable.

## Run and test locally

You need Python 3 to run a simple local web server. From the project folder, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. To stop the server, return to the terminal and press **Ctrl+C**. If port 8000 is already in use, choose another port, for example:

```sh
python3 -m http.server 8001
```

Then open <http://localhost:8001>. Do not open `index.html` directly from the file system; the browser needs an HTTP server to load JavaScript modules.

Test account creation and sign-in, lesson/scenario feedback, quiz submission, and progress persistence. Use separate test learner accounts when checking that one learner cannot see another learner's data.
## Publish your copy with GitHub Pages

1. Create a GitHub repository, for example `cloud-basics`.
2. From the project folder, initialize Git and add the site files:

   ```sh
   git init -b main
   git add index.html app.js content.js styles.css firebase-config.js firestore.rules README.md
   git status
   ```

3. Review `git status` and make sure it lists only files you intend to publish. Commit them:

   ```sh
   git commit -m "Publish Cloud Basics site"
   ```

4. Connect the local project to your repository and push the `main` branch. Replace `YOUR-GITHUB-USERNAME` with your username:

   ```sh
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/cloud-basics.git
   git push -u origin main
   ```

   If the GitHub repository was created with a README or other files, reconcile those files before pushing; do not force-push.

5. On GitHub, open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **`main`** and **`/(root)`**, and save.
6. Wait for the Pages deployment to complete. The site URL will be:

   `https://YOUR-GITHUB-USERNAME.github.io/cloud-basics/`

7. Visit the URL and test sign-up and sign-in. If Firebase reports an unauthorized-domain error, add `YOUR-GITHUB-USERNAME.github.io` under Firebase **Authentication → Settings → Authorized domains**.

There is no build command or generated output folder: GitHub Pages serves `index.html` and the other site files from the repository root.

## Learner accounts and admin access

### Learner accounts

Learners select **Create an account**, enter their email address and a password, and are signed in after account creation. Their progress is stored in a Firestore document at `users/{uid}`. Learners can access only their own document; never grant learner accounts admin access.

### Grant or revoke admin access

Admin access is assigned by the Firebase project owner in the Firebase console, not from the website:

1. Create the intended account through the site's **Create an account** page.
2. In Firebase **Authentication → Users**, find that account and copy its UID.
3. In **Firestore Database → Data**, create a collection named `admins`.
4. Create a document in `admins` with the exact UID as its document ID. Add a boolean field named `enabled` and set it to `true`.
5. Sign out and sign back in with that account. The **Admin** tab should show the read-only learner overview.
6. To revoke access, delete the corresponding `admins/{uid}` document or set `enabled` to `false`.

Admins can read learner records, which may contain personally identifiable information, quiz answers, scores, and reflections. Give admin access only to trusted project owners. Admin permissions apply to the Firebase project used by the site's configuration.

### Verify account separation

Create two test learner accounts and submit different work in each. Sign out between accounts. Confirm that each learner sees only their own dashboard and has no **Admin** tab. Then sign in as an enabled admin and confirm that the admin overview can see both records. Do not use a real learner's account or share passwords while testing.

## Course content and results

- Edit quiz, lesson, scenario, and reflection content in [`content.js`](./content.js). The UI and dashboard flows are in [`app.js`](./app.js).
- The course introduces Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as a Service (SaaS), and public, private, hybrid, and multi-cloud.
- Lesson and scenario checks provide immediate feedback. Pre-test and post-test explanations appear after the whole test is submitted, preserving the initial assessment baseline.
- The pre-test and post-test use matched topics and compare results only when both attempts use the current quiz version. Earlier-version results are retained but are not compared with the current version.
- The signed-in **Cloud landscape** tab provides illustrative vendor and product examples. It is not an exhaustive directory or a market-share ranking.
- Lesson and scenario pages include references. The course also links to NIST SP 800-145 and primary cloud-provider documentation where I referenced.

## Data model

Each learner's `users/{uid}` document can contain pre-test and post-test scores and answers, lesson completion, scenario responses, reflection text and ratings, and timestamps. The project owner (Myself) can inspect or export records in Firebase **Firestore Database → Data → users**. Handle exported records as sensitive data.
