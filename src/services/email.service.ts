import * as SibApiV3Sdk from "@getbrevo/brevo";

interface VerificationEmailParams {
  userName: string;
  toEmail: string;
  toName: string;
  verificationLink: string;
  companyLogoUrl: string;
}

class EmailService {
  private readonly BREVO_API_KEY: string;
  private readonly apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  private readonly VERIFY_EMAIL_TEMPLATE_ID: number = 19;

  constructor() {
    this.BREVO_API_KEY = process.env.BREVO_API_KEY || "";
    if (!this.BREVO_API_KEY) {
      throw new Error("Brevo API key is missing");
    }

    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      this.BREVO_API_KEY
    );
  }

  public sendVerificationEmail = async ({
    userName,
    toEmail,
    verificationLink,
  }: VerificationEmailParams): Promise<void> => {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      const currentYear = new Date().getFullYear();
      sendSmtpEmail.sender = {
        name: "Lingo Frame",
        email: "no-reply@lingoframe.com",
      };
      sendSmtpEmail.to = [{ email: toEmail, name: userName }];
      sendSmtpEmail.templateId = this.VERIFY_EMAIL_TEMPLATE_ID;
      sendSmtpEmail.params = {
        user_name: userName,
        current_year: currentYear,
        verification_link: verificationLink,
      };

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to send verification email: ${errorMessage}`);
    }
  };
}

export default EmailService;
