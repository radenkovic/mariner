// @flow
import nodemailer from 'nodemailer';
import Mustache from 'mustache';
import { NoConfigException, SendFailedException } from './mailer.exceptions';

type NodeMailerTransport = {
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string,
    pass: string
  }
};

type MailerConfiguration = {
  transport: NodeMailerTransport,
  from: string,
  renderer?: Function
};

type EmailOptions = {
  to: string,
  from?: string,
  subject: string,
  html: string,
  variables: Object,
  baseTemplate?: string
};

export default class Mailer {
  from: string;

  render: Function;

  transporter: Function;

  constructor(config: MailerConfiguration) {
    if (!config) throw new NoConfigException();
    this.from = config.from;
    this.transporter = nodemailer.createTransport(config.transport);
    this.render = config.renderer || Mustache.render;
  }

  parse(template: string, variables: Object, baseTemplate?: string): string {
    const body = this.render(template, variables);
    return baseTemplate
      ? this.render(baseTemplate, { email_body: body })
      : body;
  }

  send(options: EmailOptions) {
    try {
      if (!options.variables) options.variables = {};
      if (!options.from) options.from = this.from;
      options.subject = this.parse(options.subject, options.variables);
      options.html = this.parse(
        options.html,
        options.variables,
        options.baseTemplate
      );
      return this.transporter.sendMail(options);
    } catch (error) {
      throw new SendFailedException('Send email failed', { ...options, error });
    }
  }
}
