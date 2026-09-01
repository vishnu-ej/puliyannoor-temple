import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || '';
    const resend = new Resend(apiKey);
    const { email, otp, purpose, name } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const recipientName = name ? name.trim() : 'Devotee Pilgrim';

    // Purpose mapping for titles and descriptions
    let titleText = 'OTP Verification Code';
    let purposeDescription = 'Please use the following 6-digit One-Time Password (OTP) to complete your verification with Puliyannoor Sree Mahadeva Temple.';

    if (purpose === 'signup') {
      titleText = 'Devotee Account Registration OTP';
      purposeDescription = 'Thank you for registering with Puliyannoor Sree Mahadeva Temple Portal. Please enter this code to verify your email address and activate your devotee account.';
    } else if (purpose === 'forgot_password') {
      titleText = 'Devotee Password Reset OTP';
      purposeDescription = 'We received a request to reset the password for your devotee account. Use the OTP code below to verify and choose a new password.';
    } else if (purpose === 'admin_reset') {
      titleText = 'Devaswom Admin Security OTP';
      purposeDescription = 'A request has been initiated to reset the Administrative password for Puliyannoor Ooranma Devaswom. Enter this code to verify administrative authorization.';
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Puliyannoor Devaswom <onboarding@resend.dev>';

    // Beautiful Temple-Themed Responsive HTML Email Template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleText}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3EBD7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 24px; border: 2px solid #C99738; box-shadow: 0 10px 30px rgba(97, 12, 27, 0.1); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #610C1B 0%, #38050E 100%); padding: 32px 24px; border-bottom: 3px solid #C99738;">
              <div style="width: 54px; height: 54px; border-radius: 18px; background: rgba(201, 151, 56, 0.2); border: 2px solid #E6BE65; color: #E6BE65; font-size: 26px; line-height: 50px; text-align: center; margin: 0 auto 12px auto; font-weight: bold;">
                ॐ
              </div>
              <h1 style="margin: 0; color: #FAF5E8; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                പുളിയന്നൂർ ശ്രീ മഹാദേവ ക്ഷേത്രം
              </h1>
              <p style="margin: 4px 0 0 0; color: #E6BE65; font-size: 13px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                Puliyannoor Sree Mahadeva Temple • Pala
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 28px; background-color: #FAF5E8;">
              <p style="margin: 0 0 16px 0; color: #38050E; font-size: 16px; font-weight: 600;">
                Namaskaram, ${recipientName}
              </p>
              <p style="margin: 0 0 24px 0; color: #5A382A; font-size: 14px; line-height: 1.6;">
                ${purposeDescription}
              </p>

              <!-- OTP Code Display Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="background-color: #FFFFFF; border-radius: 18px; border: 2px dashed #C99738; padding: 24px 16px;">
                    <span style="display: block; color: #8C6219; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      Your 6-Digit Verification Code
                    </span>
                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #610C1B; font-family: 'Courier New', Courier, monospace; margin: 6px 0;">
                      ${otp}
                    </div>
                    <span style="display: block; color: #7A5835; font-size: 11px; margin-top: 8px;">
                      ⏱️ Valid for 10 minutes. Do not share this code with anyone.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Notice & Security Advice -->
              <div style="margin-top: 28px; padding: 16px; background-color: #FFFDF9; border-radius: 12px; border-left: 4px solid #610C1B;">
                <p style="margin: 0; color: #5A382A; font-size: 12px; line-height: 1.5;">
                  <strong>Security Note:</strong> Temple Devaswom officials will never ask you for your password or OTP. If you did not make this request, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1A0409; padding: 22px 20px; border-top: 1px solid rgba(201, 151, 56, 0.3);">
              <p style="margin: 0; color: #FAF5E8; font-size: 12px; font-weight: 600;">
                Puliyannoor Ooranma Devaswom
              </p>
              <p style="margin: 4px 0 0 0; color: #C99738; font-size: 11px;">
                Puliyannoor P.O., Pala, Kottayam, Kerala 686573 • Phone: +91 4822 212345
              </p>
              <p style="margin: 8px 0 0 0; color: #A68B67; font-size: 10px;">
                This is an automated notification from the official Puliyannoor Temple Portal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const data = await resend.emails.send({
      from: fromAddress,
      to: [cleanEmail],
      subject: `[${otp}] ${titleText} - Puliyannoor Temple`,
      html: emailHtml,
    });

    if (data.error) {
      console.warn('Resend send warning:', data.error);
      return NextResponse.json(
        {
          success: false,
          error: data.error.message || 'Failed to dispatch email via Resend',
          data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent successfully to ${cleanEmail}`,
      id: data.data?.id,
    });
  } catch (error: any) {
    console.error('Resend API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while sending email',
      },
      { status: 500 }
    );
  }
}
