import styled from "@emotion/styled";
import { H1, H2, UL, P } from "../components/typography";
import {
  Button,
  FormWrapper,
  Input,
  InputWrapper,
  FormGroup,
  TextArea,
  P as PForm
} from "./../components/forms";
import axios from "axios";

import { useState } from "react";

const Reasons = styled(UL)`
  padding: 1em 2.5em 1em 2.5em;
`;
const Title = styled(H1)`
  text-align: center;
  padding-bottom: 1em;
`;
const Subtitle = styled(H2)`
  text-align: center;
  padding-bottom: 1em;
`;

const centerStyle = { textAlign: "center" };
export default function CorporatePartnerships() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
    const firstName = e.target.firstname.value;
    const lastName = e.target.lastname.value;
    const email = e.target.email.value;
    const companyName = e.target.companyname.value;
    const message = e.target.message.value;

    try {
      await axios.post(
        "https://cie-edge-functions-engelmav.vercel.app/api/partner",
        { firstName, lastName, email, companyName, message }
      );
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Title>Why hire from Coding in English?</Title>
      <Subtitle style={centerStyle}>Uniquely Experienced Talent</Subtitle>
      <P>
        Our graduates have passed through a multidisciplinary training program
        to ensure they can make strides in your business and deliver to market
        -- or improve your current offering.
      </P>
      <Reasons>
        <li>
          Graduates are well-versed in modern tech tools with high productivity,
          including React, Python, and Linux
        </li>
        <li>
          Coding in English teaches graduates essential communication skills for
          the English-speaking information economy workers
        </li>{" "}
        <li>
          Graduates have real-world experience from the beginning, thanks to our
          unique, immersive curriculum. This means they are quick to adapt and
          understand the trade-offs of tech decisions and product delivery
        </li>
      </Reasons>{" "}
      <Subtitle style={centerStyle}>Do Good While Increasing Value </Subtitle>
      <P>
        Coding in English is specially designed to offer community members
        access to the software industry that would not ordinarily have such
        access - simply because of language barriers.
      </P>
      <Title>Become a Partner</Title>
      <FormWrapper>
        {submitted ? (
          <PForm>
            Thank you for reaching out to Coding in English. We will be in
            contact within the next two business days.
          </PForm>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputWrapper>
              <FormGroup>
                <Input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input type="email" name="email" placeholder="Email" required />
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  name="companyname"
                  placeholder="Company Name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <TextArea name="message" placeholder="Message" required />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </InputWrapper>
          </form>
        )}
      </FormWrapper>
    </div>
  );
}
