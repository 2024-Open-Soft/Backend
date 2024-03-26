const accountSid =
  process.env.TWILIO_ACCOUNT_SID || "ACdf631cc348aaa62434760a4cca717fa3";
const authToken =
  process.env.TWILIO_AUTH_TOKEN || "691c4ff331d54bfa8ab55c274cd66f38";
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "+19033002486";

const client = require("twilio")(accountSid, authToken);

async function message({ to, body }) {
  try {
    const message = await client.messages.create({
      body: `${body}`,
      from: twilioNumber, // Twilio number
      messagingServiceSid:
        process.env.TWILIO_MS_SID || "MGe71c0f53f63ef9b4dece4d9e167bfa42",
      to: `${to}`,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = message;
