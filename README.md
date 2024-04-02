# Backend

Backend for MFLIX

## Table of Contents

- [Installation](#installation)
- [Setting up Razorpay](#setting-up-razorpay)
- [Defining environment variables](#defining-environment-variables)
- [Run the project](#run-the-project)
- [API endpoints](#api-endpoints)

## Installation

1. Download the repository and open a terminal.

2. Navigate to the project directory:

    ```bash
    cd Backend
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

    | Variables           | Values                                      |
    | ------------------- | ------------------------------------------- |
    | Webhook URL         | *`<your backend url>/payment/verification`* |
    | Webhook Secret      | Generate a strong secret and save it        |
    | Active events       | Select `payment.captured`                   |

## Defining environment variables

```bash
DATABASE_URL="<mongodb url>"
RZ_KEY_ID="<razorpay key id>"
RZ_KEY_SECRET="<razorpay key secret>"
RZ_WEBHOOK_SECRET="<razorpay webhook secret>"
TWILIO_ACCOUNT_SID="<twilio account sid>"
TWILIO_AUTH_TOKEN="<twilio auth token>"
TWILIO_PHONE_NUMBER="<twilio phone number>"
TWILIO_MS_SID="<twilio ms sid>"
AWS_ACCESS_KEY_ID="<aws access key id>"
AWS_SECRET_ACCESS_KEY="<aws secret access key>"
AWS_MEDIACONVERT_ROLE="<aws media convert role>"
AWS_S3_BUCKET="<aws s3 bucket>"
AWS_CLOUDFRONT_KEYPAIR_ID="<aws cloudfront key pair id>"
AWS_CLOUDFRONT_DOMAIN="<aws cloudfront domain>"
HUGGINGFACE_API_KEY_1="<huggingface api key 1>"
HUGGINGFACE_API_KEY_2="<huggingface api key 2>"
OPENAI_API_KEY_1="<openai api key 1>"
OPENAI_API_KEY_2="<openai api key 2>"
OPENAI_API_URL="<openai api url>"
PORT="<port for backend>"
BASE_URL="<base url for frontend>"
EMAIL="<email to send otp with>"
EMAIL_PASSWORD="<app password for email>"
```


## Run the project

Use the following command to run:

```bash
npm run dev
```


## API endpoints

<table>
    <thead>
        <tr>
            <th>Route</th>
            <th>Sub route</th>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=19>/admin</td>
            <td>/user</td>
            <td>get</td>
            <td>get all users</td>
        </tr>
        <tr>
            <td>/user/:id</td>
            <td>get</td>
            <td>get a particular user by id</td>
        </tr>
        <tr>
            <td>/user</td>
            <td>post</td>
            <td>create user</td>
        </tr>
        <tr>
            <td>/user/:id</td>
            <td>put</td>
            <td>update user by id</td>
        </tr>
        <tr>
            <td>/user/:id</td>
            <td>delete</td>
            <td>delete a user by id</td>
        </tr>
        <tr>
            <td>/movie/:id</td>
            <td>get</td>
            <td>get a movie by id</td>
        </tr>
        <tr>
            <td>/movie</td>
            <td>get</td>
            <td>get all movies</td>
        </tr>
        <tr>
            <td>/movie/comments</td>
            <td>delete</td>
            <td>delete a comment</td>
        </tr>
        <tr>
            <td>/plan</td>
            <td>post</td>
            <td>create a subscription plan</td>
        </tr>
        <tr>
            <td>/plan/:id</td>
            <td>put</td>
            <td>update plan by id</td>
        </tr>
        <tr>
            <td>/plan/:id</td>
            <td>delete</td>
            <td>delete plan by id</td>
        </tr>
        <tr>
            <td>/movie/upload</td>
            <td>post</td>
            <td>create a new movie and upload movie details</td>
        </tr>
        <tr>
            <td>/movie/:movieId/upload</td>
            <td>post</td>
            <td>upload movie file by movieId</td>
        </tr>
        <tr>
            <td>/movie/:id</td>
            <td>patch</td>
            <td>update movie by id</td>
        </tr>
        <tr>
            <td>/movie/:movieId/delete</td>
            <td>delete</td>
            <td>delete movie by movieId</td>
        </tr>
        <tr>
            <td>/movie/:movieId/trailer/upload</td>
            <td>post</td>
            <td>upload trailer by movieId</td>
        </tr>
        <tr>
            <td>/movie/:movieId/trailer/delete</td>
            <td>delete</td>
            <td>delete trailer by movieId</td>
        </tr>
        <tr>
            <td>/movie/:movieId/poster/upload</td>
            <td>post</td>
            <td>upload poster by movieId</td>
        </tr>
        <tr>
            <td>/movie/:movieId/poster/delete</td>
            <td>delete</td>
            <td>delete poster by movieId</td>
        </tr>
        <tr>
            <td rowspan=4>/comment</td>
            <td>/</td>
            <td>get</td>
            <td>get comments of a movie</td>
        </tr>
        <tr>
            <td>/</td>
            <td>post</td>
            <td>post comment to a movie</td>
        </tr>
        <tr>
            <td>/</td>
            <td>put</td>
            <td>update comment of a movie</td>
        </tr>
        <tr>
            <td>/</td>
            <td>delete</td>
            <td>delete comment of a movie</td>
        </tr>
        <tr>
            <td rowspan=11>/movie</td>
            <td>/history</td>
            <td>post</td>
            <td>add to the history of a user</td>
        </tr>
        <tr>
            <td>/history</td>
            <td>delete</td>
            <td>remove from the history of a user</td>
        </tr>
        <tr>
            <td>/watchlist</td>
            <td>post</td>
            <td>add to the watchlist of a user</td>
        </tr>
        <tr>
            <td>/watchlist</td>
            <td>delete</td>
            <td>remove from the watchlist of a user</td>
        </tr>
        <tr>
            <td>/</td>
            <td>get</td>
            <td>get a list of all movies</td>
        </tr>
        <tr>
            <td>/:id</td>
            <td>get</td>
            <td>get details of a movie by id</td>
        </tr>
        <tr>
            <td>/latest</td>
            <td>get</td>
            <td>get a list of all the latest movies</td>
        </tr>
        <tr>
            <td>/upcoming</td>
            <td>get</td>
            <td>get a list of all the upcoming movies</td>
        </tr>
        <tr>
            <td>/featured</td>
            <td>get</td>
            <td>get a list of all the featured movies by the admin</td>
        </tr>
        <tr>
            <td>/filter</td>
            <td>get</td>
            <td>filter all the movies shown by genres, languages and ratings</td>
        </tr>
        <tr>
            <td>/watch</td>
            <td>post</td>
            <td>get the link to watch the movie</td>
        </tr>
        <tr>
            <td rowspan=2>/otp</td>
            <td>/generate</td>
            <td>post</td>
            <td>generate the otp for the specified phoneNumber or the email and send it through the respective service</td>
        </tr>
        <tr>
            <td>/verify</td>
            <td>post</td>
            <td>verify the otp specified by the user</td>
        </tr>
        <tr>
            <td rowspan=3>/password</td>
            <td>/forgot</td>
            <td>post</td>
            <td>send the password reset link to the email</td>
        </tr>
        <tr>
            <td>/reset</td>
            <td>post</td>
            <td>resets the password</td>
        </tr>
        <tr>
            <td>/valid-token</td>
            <td>post</td>
            <td>to prevent the user from accessing the reset password route by verifying the validity of the token in the params</td>
        </tr>
        <tr>
            <td rowspan=2>/payment</td>
            <td>/link</td>
            <td>post</td>
            <td>generates the payment link</td>
        </tr>
        <tr>
            <td>/verification</td>
            <td>post</td>
            <td>verifies the payment</td>
        </tr>
        <tr>
            <td rowspan=2>/plan</td>
            <td>/</td>
            <td>get</td>
            <td>get a list of subscription plans</td>
        </tr>
        <tr>
            <td>/:id</td>
            <td>get</td>
            <td>get the particular subscription plan by id</td>
        </tr>
        <tr>
            <td rowspan=3>/search</td>
            <td>/semantic</td>
            <td>get</td>
            <td>to enable the users to search semantically</td>
        </tr>
        <tr>
            <td>/searchOnEnter</td>
            <td>get</td>
            <td>to get the movies based on the search button submission</td>
        </tr>
        <tr>
            <td>/autocomplete</td>
            <td>get</td>
            <td>for the autocomplete feature on the search bar</td>
        </tr>
        <tr>
            <td rowspan=5>/user</td>
            <td>/register</td>
            <td>post</td>
            <td>to register the user</td>
        </tr>
        <tr>
            <td>/login</td>
            <td>post</td>
            <td>to login the user</td>
        </tr>
        <tr>
            <td>/logout</td>
            <td>get</td>
            <td>to logout the user and delete the token present in the database</td>
        </tr>
        <tr>
            <td>/profile</td>
            <td>get</td>
            <td>to get the details of the given user</td>
        </tr>
        <tr>
            <td>/profile</td>
            <td>put</td>
            <td>to update the details of the given user</td>
        </tr>
    </tbody>
</table>
