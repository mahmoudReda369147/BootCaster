// authFunctions.js
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const loginWithEmailPassword = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        switch (error.code) {
            case "auth/user-not-found":
                throw new Error("user not found");
            case "auth/wrong-password":
                throw new Error("wrong password");
            case "auth/invalid-email":
                throw new Error("invalid email");
            case "auth/user-disabled":
                throw new Error("user disabled");
            case "auth/too-many-requests":
                throw new Error("too many requests, please try again later");
            case "auth/network-request-failed":
                throw new Error("network request failed");
            case "auth/invalid-credential":
                throw new Error("invalid credential");
            default:
                throw new Error(
                    `error in login with email and password: ${error.message}`
                );
        }
    }
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        switch (error.code) {
            case "auth/popup-closed-by-user":
                throw new Error("popup closed by user");
            case "auth/cancelled-popup-request":
                throw new Error("popup cancelled");
            case "auth/popup-blocked":
                throw new Error("popup blocked");
            case "auth/popup-blocked-by-client":
                throw new Error("popup blocked by client");
            case "auth/popup-blocked-by-extension":
                throw new Error("popup blocked by extension");
            default:
                throw new Error(`error in login with google: ${error.message}`);
        }
    }
};

export const signUpWithEmailPassword = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return result.user;
    } catch (error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                throw new Error("email already in use");
            case "auth/invalid-email":
                throw new Error("invalid email");
            case "auth/weak-password":
                throw new Error("weak password");
            case "auth/network-request-failed":
                throw new Error("network request failed");
            case "auth/invalid-credential":
                throw new Error("invalid credential");
            default:
                throw new Error(`error in sign up: ${error.message}`);
        }
    }
};

export const signOutUser = async () => {
    await signOut(auth);
};
