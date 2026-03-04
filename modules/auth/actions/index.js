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

    const email = emailAddresses[0]?.emailAddress;

    if (!email) {
      return { success: false, message: "Email not found" };
    }

    const newUser = await db.user.upsert({
      where: { clerkId: id },
      update: {
        firstName,
        lastName,
        email: emailAddresses[0]?.emailAddress,
        imageUrl,
      },
      create: {
        clerkId: id,
        firstName,
        lastName,
        email: emailAddresses[0]?.emailAddress,
        imageUrl,
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onboarded successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while onboarding user",
    };
  }
};
