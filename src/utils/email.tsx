import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";
import type { JSXElementConstructor } from "react";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import * as React from "react";

type TMailConfig<TProps> = Omit<Mail.Options, "html"> & { props: TProps };

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  host: "smtp.gmail.com",
  auth: {
    user: "arunjoseph3007@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default class Mailer<TProps> {
  template: JSXElementConstructor<TProps>;

  constructor(template: JSXElementConstructor<TProps>) {
    this.template = template;
  }

  getHtml(props: TProps) {
    const html = render(<this.template {...props} key={0} />);
    return html;
  }

  async sendMail(options: TMailConfig<TProps>) {
    const res = await transporter.sendMail({
      ...options,
      html: this.getHtml(options.props),
    });

    return res;
  }

  async sendMailThrough(
    options: TMailConfig<TProps>,
    transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
  ) {
    const res = await transport.sendMail({
      ...options,
      html: this.getHtml(options.props),
    });

    return res;
  }
}
