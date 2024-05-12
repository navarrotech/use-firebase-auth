/*! *****************************************************************************
Copyright (c) Alex navarro. All rights reserved.
MIT License
***************************************************************************** */
import type { Request, Response, NextFunction } from 'express';
import type { app } from 'firebase-admin';
type FirebaseApp = app.App;
export type UserSession = {
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
    firebase: {
        identities: {
            email: string[];
        };
        sign_in_provider: "password" | string;
    };
};
export type SessionedRequest = Request & {
    authorized: boolean;
    user: UserSession | null;
};
export type UseFirebaseAuthOptions = {
    firebaseApp: FirebaseApp;
};
export default function useFirebaseAuth(options: UseFirebaseAuthOptions): (request: Request, response: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=use-firebase-auth.d.ts.map