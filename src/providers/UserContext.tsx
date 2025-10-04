"use client";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { UserContext } from "../hooks/useUser";
import { getUserData, createUserData } from "@/services/userService";
import { UserRole, type UserData } from "@/types/user";

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user data from Firestore
        let userDoc = await getUserData(currentUser.uid);

        // If user document doesn't exist, create one with default role
        if (!userDoc && currentUser.email) {
          await createUserData(currentUser.uid, currentUser.email, UserRole.USER, currentUser.displayName || undefined);
          userDoc = await getUserData(currentUser.uid);
        }

        setUserData(userDoc);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userData?.role === UserRole.ADMIN;

  const hasRole = (role: UserRole): boolean => {
    return userData?.role === role;
  };

  return <UserContext.Provider value={{ user, userData, loading, isAdmin, hasRole }}>{children}</UserContext.Provider>;
};
