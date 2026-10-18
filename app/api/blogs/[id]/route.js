
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import Blog from "@/models/Blog";
import User from "@/models/User";

const updateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  content: z.string().trim().min(1, "Content is required"),
});

function isValidBlogId(id) {
  return mongoose.isValidObjectId(id);
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Your session has expired or you are not logged in. Please log in again.",
    },
    { status: 401 }
  );
}

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, message: "Invalid blog ID" },
    { status: 400 }
  );
}

// GET /api/blogs/:id
// Anyone can view an individual blog.
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!isValidBlogId(id)) {
      return invalidIdResponse();
    }

    await connectDB();

    const blog = await Blog.findById(id)
      .populate("author", "name")
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Get blog error:", error.message);

    return NextResponse.json(
      { success: false, message: "Unable to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/:id
// Only the blog's author can update it.
export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    if (!isValidBlogId(id)) {
      return invalidIdResponse();
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const result = updateBlogSchema.safeParse(body);

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

    // Update only if the authenticated user owns this blog.
    const updatedBlog = await Blog.findOneAndUpdate(
      {
        _id: id,
        author: authUser.userId,
      },
      {
        $set: {
          title: result.data.title,
          content: result.data.content,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("author", "name")
      .lean();

    if (!updatedBlog) {
      // Check whether the blog exists and diagnose ownership mismatch.
      const existingBlog = await Blog.findById(id)
        .select("author")
        .lean();

      if (!existingBlog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      console.warn("Blog update ownership mismatch", {
        blogId: id,
        authenticatedUserId: authUser.userId,
        blogAuthorId: existingBlog.author?.toString(),
      });

      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to edit this blog",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error.message);

    return NextResponse.json(
      { success: false, message: "Unable to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/:id
// Only the blog's author can delete it.
export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    if (!isValidBlogId(id)) {
      return invalidIdResponse();
    }

    await connectDB();

    // Delete only when both the blog ID and owner match.
    const deletedBlog = await Blog.findOneAndDelete({
      _id: id,
      author: authUser.userId,
    });

    if (!deletedBlog) {
      const existingBlog = await Blog.findById(id)
        .select("author")
        .lean();

      if (!existingBlog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      console.warn("Blog delete ownership mismatch", {
        blogId: id,
        authenticatedUserId: authUser.userId,
        blogAuthorId: existingBlog.author?.toString(),
      });

      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to delete this blog",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error.message);

    return NextResponse.json(
      { success: false, message: "Unable to delete blog" },
      { status: 500 }
    );
  }
}
