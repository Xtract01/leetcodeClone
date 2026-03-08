"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;

    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return { success: false, message: "Email not found" };
    }

    const newUser = await db.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        email,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onboarded successfully",
    };
  } catch (error) {
    console.error("Onboard Error:", error);

    return {
      success: false,
      message: "Error occurred while onboarding user",
    };
  }
};

export const currentUserRole = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    return dbUser?.role ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await currentUser();
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });
    if (!user) return null;
    return dbUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};
