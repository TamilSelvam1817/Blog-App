
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email address is too long")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

export async function POST(request) {
  try {
    // 1. Parse the request body safely
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    // 2. Validate the submitted data
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Check for an existing account
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // 5. Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 7. Return only safe user information
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate email registrations, including concurrent requests
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    console.error("Registration error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during registration",
      },
      { status: 500 }
    );
  }
}
