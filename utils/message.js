const accountSid =
  process.env.TWILIO_ACCOUNT_SID;
const authToken =
  process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

async function message({ to, body }) {
  try {
    const message = await client.messages.create({
      body: `${body}`,
      from: twilioNumber, // Twilio number
      messagingServiceSid:
        process.env.TWILIO_MS_SID,
      to: `${to}`,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = message;
