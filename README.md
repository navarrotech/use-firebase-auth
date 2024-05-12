# Express Firebase Auth

This package provides a simple and minimalistic Firebase authentication middleware designed for Express.js applications. It validates Firebase JWTs issued on the frontend, ensuring that backend services are secure and requests are authenticated. This is great for developers looking to implement Firebase authentication outside of Google Cloud environments. The goal is to be able to write custom Node.js logic without compromising on security. Whether you're developing a small project or a large-scale application, `use-firebase-auth` simplifies the integration of Firebase Auth with your server-side logic.

## Installation
```bash
npm install use-firebase-auth
// or
yarn add use-firebase-auth
```

Once npm installed the module, you need to set up a bit on the frontend and backend.

## Backend implementation:

### Short example:
```bash
import useFirebaseAuth, {
    type SessionedRequest,
    type UserSession
} from "use-firebase-auth"

// Middleware that uses the auth:
app.use(
    useFirebaseAuth({
        firebaseApp
    })
)
```

### Full example:
```bash
// Firebase Admin:
import * as firebase from 'firebase-admin'
import credentials from "./firebase.json"

// Express and middleware:
import express from "express"
import useFirebaseAuth, {
    type SessionedRequest,
    type UserSession
} from "use-firebase-auth"

const app = express()

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(credentials),
    databaseURL: "/* Your database url */"
})

// Middleware that uses the auth:
app.use(
    useFirebaseAuth({
        firebaseApp
    })
)

// Sample route
app.all('/hello', (request, response) => {
    const sessionedRequest = request as SessionedRequest

    // You can get the typed results like so:
    const authorized: boolean = sessionedRequest.authorized
    const user: UserSession = sessionedRequest.user

    console.log({ authorized, user })
    response.send('Hello World')
})

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
```

## Frontend implementation
It's important that you use the authorization header when sending requests your backend node server from your frontend like so:

```bash
// Initialize your app like normal:
const app = initializeApp({ /* Credentials */ })
const auth = getAuth(app)

// Each request, just include a Bearer token with the currentUser's token:
const token = await auth.currentUser?.getIdToken()
const request = fetch('http://localhost:3001/hello', {
    headers: {
        'Authorization': 'Bearer ' + token
    },
})
```

## Security Best Practices

When using `use-firebase-auth`, it's important to follow security best practices to protect your applications:

- **Secure Your Firebase Credentials**: Keep your Firebase credentials file secure and never expose it in your version control or to the frontend.
- **Use HTTPS**: Ensure that your backend and frontend communicate over HTTPS to protect the integrity and privacy of the authentication tokens being transmitted.

## Contribution
Contributions are welcome! If you would like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Use `yarn run install` to download dependencies
4. You'll need a test firebase project. Visit the [firebase console](https://console.firebase.google.com/) and create a test project. Ensure auth is enabled on the project, and use signing in with username/password.
5. Create some firebase credentials for web, and add the credentials to test/index.html on line 33
6. Create some firebase admin SDK credentials and add the credentials to test/firebase.ts
7. Use `yarn run dev` to start a test express.js server for developing in, and `yarn run serve-test` to start a sample frontend for testing a auth connection to.
8. Build the new changes, with `yarn run build`
9. Before committing, ensure you remove your own credentials that you added for development.
10. Make your changes and commit them: `git commit -m 'Add your feature'`
11. Push to the branch: `git push origin feature/your-feature-name`
12. Open a pull request.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
