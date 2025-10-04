import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";

/**
 * POST /api/admin/users/generate-password - Generate a secure random password (Admin only)
 */
export async function POST(request: Request) {
  const authResult = await requireRole(request, "admin");
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { length = 12 } = await request.json();

    // Generate a secure random password
    const password = generateSecurePassword(length);

    return NextResponse.json(
      {
        password,
        length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate password:", error);
    return NextResponse.json(
      { error: "Failed to generate password" },
      { status: 500 }
    );
  }
}

/**
 * Generate a secure random password
 */
function generateSecurePassword(length: number): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = "";
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
