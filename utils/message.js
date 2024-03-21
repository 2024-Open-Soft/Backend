const accountSid =
  process.env.TWILIO_ACCOUNT_SID || "AC979bb523aaaaf7c718d49305aa5a11bc";
const authToken =
  process.env.TWILIO_AUTH_TOKEN || "2d66a444045e142ed31374fb7c475357";
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "+12513179666";

const client = require("twilio")(accountSid, authToken);

async function message({ to, body }) {
  try {
    const message = await client.messages.create({
      body: `${body}`,
      from: twilioNumber, // Twilio number
      to: `${to}`,
    });

    console.log(message.sid);
  } catch (error) {
    console.log(error);
  }
}

module.exports = message;

