
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Blog from "@/models/Blog";

export async function GET() {
  let testUserId;

  try {
    await connectDB();

    // 1. Create a test user
    const user = await User.create({
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      password: "temporary-test-password",
    });

    testUserId = user._id;

    // 2. Create a blog linked to that user
    const blog = await Blog.create({
      title: "My First Database Test",
      content: "Testing MongoDB with Next.js and Mongoose.",
      author: user._id,
    });

    // 3. Retrieve the saved documents
    const savedUser = await User.findById(user._id).select("-password");

    const savedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name email"
    );

    return NextResponse.json({
      success: true,
      message: "User and blog saved and retrieved successfully!",
      user: savedUser,
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Model test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Model test failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
