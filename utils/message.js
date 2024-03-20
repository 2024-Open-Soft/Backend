async function message({ to, body }) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC979bb523aaaaf7c718d49305aa5a11bc';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '2d66a444045e142ed31374fb7c475357';
    const client = require('twilio')(accountSid, authToken);

    const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+12513179666';

    client.messages
        .create({
            body: `${body}`,
            from: twilioNumber, // Twilio number
            to: `${to}`
        })
        .then(message => console.log(message.sid));
}

module.exports = message;