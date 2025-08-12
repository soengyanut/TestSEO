import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth } from '../../firebase/firebase-config'
import { useLoginMutation, useRegisterMutation } from "../../features/auth/authSlide";

import { useNavigate } from "react-router";
import { storeAccessToken } from "../../utils/tokenUtils";

export const useLoginWithGoogle = () => {
    // setup login, popup, logout
    const [error, setError] = useState();
    // pending
    const [pending, setIsPending] = useState(false);
    // data (user credential)
    const [user, setUser] = useState(null);
    // create provider
    const provider = new GoogleAuthProvider();

    // calling signup slice 
    const [signUpRequest] = useRegisterMutation();

    //calling login slice
    const [loginRequest] = useLoginMutation();

    // navigation
    const navigate = useNavigate();

    // useEffect tracking on user credential 
    useEffect(() => {
        const unsubriber = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                throw new Error("unsubscribe user")
            }
        })
        return () => unsubriber();

    }, [])

    // setup login with github 
    const loginWithGoogle = async () => {
        setIsPending(true);
        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("login unsuccessfully");
            }
            const user = res.user;
            console.log("Google Info: ", user)

            // Try to register the user
            try {
                await signUpRequest({
                    username: user?.displayName.substring(0, 4),
                    phoneNumber: user?.phoneNumber,
                    address: {
                        addressLine1: "",
                        addressLine2: "",
                        road: "",
                        linkAddress: ""
                    },
                    email: user?.email,
                    password: `${user?.displayName.substring(0, 4)}${import.meta.env.VITE_SECRET_KEY}`,
                    confirmPassword: `${user?.displayName.substring(0, 4)}${import.meta.env.VITE_SECRET_KEY}`,
                    profile: user?.photoURL
                }).unwrap();
                // If signup is successful, try to login right after
            } catch (error) {
                // If error is 400 (already exists) or 200, proceed to login
                console.log("======> error signup : ", error)
                const checkAuth = error.status;
                if (!(checkAuth == 400 || checkAuth == 200)) {
                    setIsPending(false);
                    setError(error);
                    return;
                }
            }

            // Always try to login after signup attempt
            try {
                const loginData = await loginRequest({
                    email: user?.email,
                    password: `${user?.displayName.substring(0, 4)}${import.meta.env.VITE_SECRET_KEY}`
                }).unwrap();

                if (!loginData || !loginData.accessToken) {
                    console.log("Login isn't success");
                    navigate("/login");
                } else {
                    // Store accessToken
                    storeAccessToken(loginData.accessToken);
                    // console.log("=====> AfterDecrypted: ", getDecryptedAccessToken());
                    navigate("/products");
                }
            } catch (loginError) {
                setError(loginError);
                console.log("Login error: ", loginError);
                navigate("/login");
            }

            setIsPending(false);

        } catch (error) {
            setError(error)
            console.log(error.message)
            setIsPending(false)
        }
    }

    //logout features 
    const googleLogout = async () => {

        setIsPending(false);
        setError(null);
        try {
            await signOut(auth);
            setIsPending(true);
            console.log("Logout successfully!")
        } catch (error) {
            setError(error);
            console.log(error.message);
            setIsPending(false);
        }

    }

    return { googleLogout, loginWithGoogle, pending, error, user };
}