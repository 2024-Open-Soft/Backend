const Razorpay = require("razorpay");

const key_id = process.env.RZ_KEY_ID;
const key_secret = process.env.RZ_KEY_SECRET;

// function to generate unix timestamp which is 30 minutes past the current time
function getUnixTime() {
  const date = new Date();
  const unixTime = Math.floor(date.getTime() / 1000) + 1800;
  return unixTime;
}

const generatePaymentLink = async (
  referenceId,
  amount,
  currency,
  customer,
  planID,
  startDate,
  orignalDuration,
  user,
) => {
  const razorpayInstance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });

  const order = {
    amount: parseInt(amount) * 100, // amount in smallest currency unit
    currency: currency,
    accept_partial: false,
    notes: {
      planID: planID,
      userID: user._id,
      referenceId: referenceId,
      startDate: startDate,
      orignalDuration: orignalDuration,
    },
    customer: customer,
    expire_by: getUnixTime(), // 30 minutes past the current time
    reference_id: referenceId, // need to be unique every time
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: true,
    options: {
      checkout: {
        theme: {
          hide_topbar: true,
        },
<<<<<<< HEAD
        customer: customer,
        expire_by: getUnixTime(),   // 30 minutes past the current time
        reference_id: referenceId,    // need to be unique every time
        notify: {
            sms: true,
            email: true
        },
        reminder_enable: true,
        options: {
            checkout: {
                name: 'WIIO',
                theme: {
                    hide_topbar: true
                }
            }
        }
    }
    const res = await razorpayInstance.paymentLink.create(order)
    return res
=======
      },
    },
  };
  const res = await razorpayInstance.paymentLink.create(order);
  return res;
>>>>>>> 17425c4379726f5e79af16c009cf8b67f95382f1
};

module.exports = {
  generatePaymentLink,
};

