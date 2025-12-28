import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAuth } from "@clerk/nextjs/server";

interface FeedbackRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: "bug" | "feature" | "general";
}

export async function POST(req: NextRequest) {
  try {
    // Get user info if authenticated (optional)
    const { userId } = getAuth(req);

    const body: FeedbackRequest = await req.json();
    const { name, email, subject, message, type = "general" } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create Trello card - route to different lists based on feedback type
    const trelloApiKey = process.env.TRELLO_API_KEY;
    const trelloToken = process.env.TRELLO_TOKEN;

    // Map feedback type to the appropriate Trello list ID
    let trelloListId: string | undefined;
    switch (type) {
      case "general":
        trelloListId = process.env.TRELLO_GENERAL_LIST_ID;
        break;
      case "bug":
        trelloListId = process.env.TRELLO_BUG_LIST_ID;
        break;
      case "feature":
        trelloListId = process.env.TRELLO_ENHANCEMENT_LIST_ID;
        break;
      default:
        trelloListId = process.env.TRELLO_GENERAL_LIST_ID;
    }

    if (trelloApiKey && trelloToken && trelloListId) {
      try {
        const trelloCardName = `${type.toUpperCase()}: ${subject}`;
        const trelloCardDesc = `**From:** ${name} (${email})${
          userId ? `\n**User ID:** ${userId}` : ""
        }\n\n**Type:** ${type}\n\n**Message:**\n${message}`;

        const trelloUrl = `https://api.trello.com/1/cards?key=${trelloApiKey}&token=${trelloToken}`;

        const trelloResponse = await fetch(trelloUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trelloCardName,
            desc: trelloCardDesc,
            idList: trelloListId,
            pos: "top",
          }),
        });

        if (!trelloResponse.ok) {
          console.error("Trello API error:", await trelloResponse.text());
          // Continue even if Trello fails - still send email
        }
      } catch (trelloError) {
        console.error("Error creating Trello card:", trelloError);
        // Continue even if Trello fails - still send email
      }
    }

    // Send email notification
    const recipientEmail = process.env.RESEND_TO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    // Validate email configuration
    if (!resendApiKey) {
      console.warn(
        "RESEND_API_KEY is not configured. Skipping email notification."
      );
    } else if (!fromEmail) {
      console.warn(
        "RESEND_FROM_EMAIL is not configured. Skipping email notification."
      );
    } else if (!recipientEmail) {
      console.warn(
        "RESEND_TO_EMAIL is not configured. Skipping email notification."
      );
    } else {
      try {
        // Initialize Resend client with API key
        const resend = new Resend(resendApiKey);

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: email,
          subject: `[${type.toUpperCase()}] ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #667eea;">New Feedback Received</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Type:</strong> ${type.toUpperCase()}</p>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ""}
              </div>
              <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="margin-top: 0;">Subject:</h3>
                <p style="margin-bottom: 20px;">${subject}</p>
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
          text: `
New Feedback Received

Type: ${type}
From: ${name}
Email: ${email}
${userId ? `User ID: ${userId}` : ""}
Subject: ${subject}

Message:
${message}
          `,
        });

        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Log the full error for debugging
        if (emailError instanceof Error) {
          console.error("Email error details:", emailError.message);
        }
        // Don't fail the request if email fails - Trello card was created successfully
        // Just log the error
      }
    }

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
