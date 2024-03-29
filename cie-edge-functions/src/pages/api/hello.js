import { crossOrigins, ses } from "../../util";

export default async (req, res) => {
  const xoRes = crossOrigins(res);
  if (req.method === "POST") {
    const { name, email } = req.body;

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
