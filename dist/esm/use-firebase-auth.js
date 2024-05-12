// @ts-check Copyright © 2024 Navarrotech
/// <reference types="node" />
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jwtDecode } from "jwt-decode";
export default function useFirebaseAuth(options) {
    return function firebaseAuthMiddleware(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionedRequest = request;
            const token = sessionedRequest.headers.authorization;
            // Always assume the request is unauthorized
            sessionedRequest.authorized = false;
            sessionedRequest.user = null;
            // If there's a token to check...
            if (token) {
                try {
                    // Decode the JWT token
                    const session = jwtDecode(token);
                    // Get the user from Firebase
                    const user = yield options.firebaseApp.auth().getUser(session === null || session === void 0 ? void 0 : session.user_id);
                    // Set the user in the request
                    if (user) {
                        sessionedRequest.authorized = true;
                        sessionedRequest.user = session;
                    }
                }
                catch (error) {
                    console.error("useFirebaseAuthError", error);
                }
            }
            next();
        });
    };
}
//# sourceMappingURL=use-firebase-auth.js.map