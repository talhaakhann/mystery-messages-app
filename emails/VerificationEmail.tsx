import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Verify Your Email
          </Heading>

          <Text style={paragraph}>
            Hi {username},
          </Text>

          <Text style={paragraph}>
            Thank you for signing up. Please use the verification code below
            to verify your email address:
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{verifyCode}</Text>
          </Section>

          <Text style={paragraph}>
            This code will expire shortly. If you didn't create an account,
            you can safely ignore this email.
          </Text>

          <Text style={footer}>
            © 2026 Your App. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
};

const heading = {
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
};

const codeContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const code = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
};

const footer = {
  textAlign: "center" as const,
  color: "#666",
  fontSize: "12px",
  marginTop: "24px",
};