import dotenv from "dotenv";
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export function htmlEmailWrapper(content: string): string {
  return `
  <style>
    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }
  </style>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${FRONTEND_URL}/assets/images/scale-maestro.png" alt="ScaleMaestro Logo" style="width: 150px;">
        </div>
        <div>
          ${content}
        </div>
        <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
          <p>© ${new Date().getFullYear()} ScaleMaestro. All rights reserved.</p>
            <p>If you did not request this email, please ignore it.</p>
        </div>
      </div>
    </div>
  `;
}
