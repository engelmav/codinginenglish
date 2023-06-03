import { crossOrigins, ses } from "../../util";

export default async (req, res) => {
  const xoRes = crossOrigins(res);
  if (req.method === "POST") {
    const { firstName, lastName, companyName, email, message } = req.body;

    const params = {
      Destination: {
        ToAddresses: ["vincent@codinginenglish.com"],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `New partner submission:\nFirst: ${firstName}\nLast: ${lastName}\nEmail: ${email}\nCompany: ${companyName}\nMessage:\n${message}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New CIE Partner Request",
        },
      },
      Source: "vincent@codinginenglish.com",
    };

    try {
      await ses.sendEmail(params).promise();
      xoRes.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      xoRes.status(500).json({ message: "Error sending email" });
    }
  } else if (req.method === "OPTIONS") {
    xoRes.status(200).json({
      body: "OK",
    });
  } else {
    xoRes.status(405).json({ message: "Method not allowed" });
  }
};
