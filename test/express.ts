// Copyright © 2024 Navarrotech

import * as firebase from 'firebase-admin'

import express from "express"
import useFirebaseAuth, { type SessionedRequest } from "../use-firebase-auth"

import credentials from "./firebase.ts"

const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert(credentials as any),
    databaseURL: "https://navarro-mealplanner-default-rtdb.firebaseio.com"
})

const app = express()

// CORs for local testing
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  response.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
      response.status(200).end()
      return;
  }

  next()
})

app.use(
    useFirebaseAuth({
        firebaseApp
    })
)

app.all('/hello', (req, res) => {
    const sessionedRequest = req as SessionedRequest
    console.log({
        authorized: sessionedRequest.authorized,
        user: sessionedRequest.user
    })
    res.send('Hello World')
})

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
