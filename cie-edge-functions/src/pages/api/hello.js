// pages/api/subscribe.js

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

export default async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, OPTIONS, DELETE"
  );
  if (req.method === "POST") {
    const { name, email } = req.body;

    // Replace with your email and subject
    const params = {
      Destination: {
        ToAddresses: ["vincent@codinginenglish.com"],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `New subscriber:\nName: ${name}\nEmail: ${email}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New Newsletter Subscriber",
        },
      },
      Source: "vincent@codinginenglish.com",
    };

    try {
      await ses.sendEmail(params).promise();
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending email" });
    }
  } else if (req.method === "OPTIONS") {
    res.status(200).json({
      body: "OK",
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
