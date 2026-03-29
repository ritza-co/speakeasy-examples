import { type ResourceMetadata } from "xmcp";

export const metadata: ResourceMetadata = {
  name: "emails",
  title: "Email List",
  description: "A list of recent emails from the inbox",
  mimeType: "application/json",
};

export default async function emailsResource(uri: URL) {
  // In a real application, this would fetch from an email API
  // For demonstration, we return a mock list of emails
  const emails = [
    {
      id: "1",
      from: "alice@example.com",
      to: "user@example.com",
      subject: "Project Update",
      body: "Here's the latest update on the project status.",
      date: "2025-01-15T10:30:00Z",
      read: false,
    },
    {
      id: "2",
      from: "bob@example.com",
      to: "user@example.com",
      subject: "Meeting Reminder",
      body: "Don't forget about our meeting tomorrow at 2 PM.",
      date: "2025-01-15T09:15:00Z",
      read: true,
    },
    {
      id: "3",
      from: "charlie@example.com",
      to: "user@example.com",
      subject: "Code Review Request",
      body: "Could you review the latest PR when you have a chance?",
      date: "2025-01-14T16:45:00Z",
      read: false,
    },
  ];

  return {
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(emails, null, 2),
        mimeType: "application/json",
      },
    ],
  };
}

