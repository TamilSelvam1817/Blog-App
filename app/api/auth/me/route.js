
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
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

    await connectDB();

    const user = await User.findById(authUser.userId).select(
      "name email createdAt"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile API error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
