// File: /api/send-whatsapp.js (Vercel Serverless Function)
import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { customerName, customerNumber, orderId, orderDetails } = req.body;

  // Validate required fields
  if (!customerName || !customerNumber || !orderId) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields: customerName, customerNumber, or orderId",
    });
  }

  // Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppNumber =
    process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  // Check if credentials exist
  if (!accountSid || !authToken) {
    return res.status(500).json({
      success: false,
      error:
        "Twilio credentials not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to environment variables.",
    });
  }

  const client = twilio(accountSid, authToken);

  // Format customer number (must include country code)
  // E.g., +923001234567
  let formattedNumber = customerNumber;
  if (!customerNumber.startsWith("+")) {
    formattedNumber = `+92${customerNumber.replace(/^0+/, "")}`; // Assuming Pakistan
  }
  const whatsappRecipient = `whatsapp:${formattedNumber}`;

  try {
    // Build message body
    let messageBody = `Hi ${customerName}! 👋\n\n`;
    messageBody += `Your order (#${orderId}) has been received successfully! ✅\n\n`;

    if (orderDetails) {
      messageBody += `*Order Details:*\n${orderDetails}\n\n`;
    }

    messageBody += `We'll notify you once your order is ready for delivery.\n\n`;
    messageBody += `Thank you for choosing us! 🍕🎉`;

    // Send WhatsApp message
    const message = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: whatsappRecipient,
      body: messageBody,
    });

    console.log(`WhatsApp message sent successfully. SID: ${message.sid}`);
    res.status(200).json({
      success: true,
      sid: message.sid,
      status: message.status,
      to: whatsappRecipient,
    });
  } catch (err) {
    console.error("Twilio WhatsApp Error:", err);

    // Handle specific error cases
    let errorMessage = err.message;
    if (err.code === 21211) {
      errorMessage =
        "Invalid phone number format. Please include country code (e.g., +923001234567)";
    } else if (err.code === 63007) {
      errorMessage =
        "Recipient has not joined the WhatsApp sandbox. They must send 'join <code>' to the Twilio sandbox number first.";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: err.code,
      details: err.moreInfo,
    });
  }
}
