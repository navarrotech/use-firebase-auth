// @ts-check Copyright © 2024 Navarrotech
/// <reference types="node" />

'use strict'

import { jwtDecode } from "jwt-decode"

// Typescript
import type { Request, Response, NextFunction } from 'express'
import type { app } from 'firebase-admin'

type FirebaseApp = app.App

export type UserSession = {
  iss: string
  aud: string
  auth_time: number
  user_id: string
  sub: string
  iat: number
  exp: number
  email: string
  email_verified: boolean
  firebase: {
    identities: {
      email: string[]
    }
    sign_in_provider: "password" | string
  }
}

export type SessionedRequest = Request & {
  authorized: boolean
  user: UserSession | null
}

export type UseFirebaseAuthOptions = {
  firebaseApp: FirebaseApp
}

export default function useFirebaseAuth(options: UseFirebaseAuthOptions) {
  return async function firebaseAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    const sessionedRequest = request as SessionedRequest

    const token = sessionedRequest.headers.authorization

    // Always assume the request is unauthorized
    sessionedRequest.authorized = false
    sessionedRequest.user = null

    // If there's a token to check...
    if (token) {
      try {
        // Decode the JWT token
        const session: UserSession = jwtDecode<UserSession>(token)
        
        // Get the user from Firebase
        const user = await options.firebaseApp.auth().getUser(session?.user_id)

        // Set the user in the request
        if (user) {
          sessionedRequest.authorized = true
          sessionedRequest.user = session
        }
      } catch (error) {
        console.error("useFirebaseAuthError", error)
      }
    }

    next()
  }
}
