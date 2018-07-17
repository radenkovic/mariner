import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Mustache from 'mustache';
import { NoConfigException, SendFailedException } from './mailer.exceptions';

type MailerConfiguration = {
  transport: {
    host: string,
    port: number,
    secure: boolean,
    auth: {
      user: string,
      pass: string
    }
  },
  templatesDir: string,
  from: string,
  renderer?: Function
};

type EmailOptions = {
  to: string,
  from?: string,
  subject: string,
  html: string,
  variables: Object
};

export default class Mailer {
  constructor(config: MailerConfiguration) {
    if (!config) throw new NoConfigException();
    this.from = config.from;
    this.templatesDir = config.templatesDir;
    this.transporter = nodemailer.createTransport(config.transport);
    this.render = config.renderer || Mustache.render;
  }

  parse(template: string, variables: Object): string {
    return this.render(template, variables);
  }

  readTemplate(template: string) {
    return fs.readFileSync(
      path.join(`${`${this.templatesDir}/${template}`}.html`),
      'UTF-8'
    );
  }

  send(options: EmailOptions) {
    try {
      if (!options.from) options.from = this.from;
      return this.transporter.sendMail(options);
    } catch (e) {
      throw new SendFailedException('Email Send Failed', options);
    }
  }

  sendTemplate(template: string, options: EmailOptions) {
    const subject = this.parse(options.subject, options.variables);
    const rawTemplate = this.readTemplate(template);
    const html = this.parse(rawTemplate, options.variables);
    return this.send({ ...options, subject, html });
  }
}
