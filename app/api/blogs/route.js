
import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import Blog from "@/models/Blog";
import User from "@/models/User";

// Validation schema for creating a blog
const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),
});

// GET /api/blogs
// GET /api/blogs?mine=true
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "true";

    let filter = {};

    // Fetch only the authenticated user's blogs when mine=true
    if (mine) {
      const authUser = await getAuthenticatedUser();

      if (!authUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Please log in first",
          },
          { status: 401 }
        );
      }

      filter = { author: authUser.userId };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean();

    return NextResponse.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch blogs",
      },
      { status: 500 }
    );
  }
}

// POST /api/blogs
export async function POST(request) {
  try {
    // Require authentication before creating a blog
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in first",
        },
        { status: 401 }
      );
    }

    // Parse JSON safely
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

    // Validate request body
    const result = createBlogSchema.safeParse(body);

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

    await connectDB();

    // Confirm that the authenticated account still exists
    const userExists = await User.exists({
      _id: authUser.userId,
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found",
        },
        { status: 401 }
      );
    }

    const { title, content } = result.data;

    // Never trust an author ID sent by the client
    const blog = await Blog.create({
      title,
      content,
      author: authUser.userId,
    });

    // Return the blog with the author's display name
    const createdBlog = await Blog.findById(blog._id)
      .populate("author", "name")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog: createdBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create blog",
      },
      { status: 500 }
    );
  }
}
