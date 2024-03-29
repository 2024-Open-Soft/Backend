# Backend

Backend for WIIO

## Table of Contents

- [Installation](#installation)
- [Defining environment variables](#defining-environment-variables)
- [Run the project](#run-the-project)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/2024-Open-Soft/Backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd backend
    ```

3. Install dependencies:

   ```node
   npm install
   ```

   or alternatively

   ```node
   npm i
   ```

   `Make sure to have nodejs and npm installed`

## Setting up Razorpay

1. Create an account at https://razorpay.com/.

2. Go to the dashboard after logging in: https://dashboard.razorpay.com/app/dashboard

3. Create an API key from `Accounts and Settings`: https://dashboard.razorpay.com/app/website-app-settings/api-keys
    > Remember to save the `key id` and `key secret`

4. Add the `key id` and `key secret` as environment variables.

5. Create an webhook (for payment verification) from `Accounts and Settings` with the following configurations at https://dashboard.razorpay.com/app/website-app-settings/webhooks
    > **Webhook URL:** *`<your backend url>/payment/verification`*
    >
    > **Webhook Secret:** Generate a strong secret and save it
    > 
    > **Active events:** Select `payment.captured`

## Defining environment variables


```bash
DATABASE_URL = "<your mongodb url>"
key_id = "<your razorpay key id>"
key_secret = "<your razorpay key secret>"
webhook_secret = "<your razorpay webhook secret>"
TWILIO_MS_SID = "<enter your twilio ms sid here>"

more to add here...
```


## Run the project

Use the following command to run:

```bash
npm start
```

