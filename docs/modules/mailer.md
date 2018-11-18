# Mailer

Mailer module is abstraction of [node-mailer](https://nodemailer.com/about/),
and [mustache](https://mustache.github.io/) for email template and email subject 
rendering with variables. However, you can use mailer with plain html, or even
replace mustache with another renderer (eg. [nunjucks](https://mozilla.github.io/nunjucks/)).

## Creating and configuring Mailer

To instantiate the Mailer class and prepare it for sending email you need to pass configuration as following:

```
import { Mailer } from 'node-mariner';

const Mail = new Mailer({
  from: '"Dan Radenkovic" <dan@radenkovic.org>',
  transport: {
    host: 'in-v3.mailjet.com',
    port: 587,  // If TLS on port 587 doesn't work, try using port 465 and/or using SSL instead
    secure: true,
    auth: {
      user: '<YOUR_USERNAME>',
      pass: '<YOUR_PASSWORD>'
    }
  },
  renderer: (content, variables) => content // optional
});

```

### Configuration Object

All keys are mandatory unless stated differently.

| key                | type     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| from               | `string` | default sender, used in format `"name" <email>`, can be overridden                            |
| transport.host     | `string` | SMTP                                                                                          |
| transport.port     | `number` | SMTP PORT (eg. 25, 587, 465)                                                                  |
| transport.secure   | `boolean`| whether to use encrypted transport                                                            |
| transport.auth     | `object` | SMTP server credentials (`auth.user`, `auth.pass`)                                            |
| renderer (optional)| `function` | optional function that has two arguments `(content, variables)` described [below](#replacing-the-renderer)|

**TIP**: If you are looking for free/cheap email plans, you can check [Mailjet](https://www.mailjet.com/), or [Amazon SES](https://aws.amazon.com/ses/).

## Mailer.send(`options`)

Mailer send function expects `options` object. All keys are mandatory unless stated differently.

| key                | type     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| from (optional)    | `string` | if you want to override default sender                                                        |
| to                 | `string`| comma separated emails of recipients                                                           |
| html               | `string` | body of the message, will be parsed with `renderer`                                           |
| subject            | `string` | subject of the message, will be parsed with `renderer`                                        |
| variables (optional)| `object` | variables to use in `html` and `subject` when parsing the template                           |
| baseTemplate (optional) | `string` | optional base template to wrap the `html`, needs to include `{{email_body}}` which will be replaced with parsed `html`|


## Sending your first email

In the [previous step](#creating-and-configuring-mailer) we prepared `Mail` for sending, so sending is straightforward:

```
const send = await Mail.send({
  from: '"Tester Tester" <test@gmail.com>', // optional
  to: 'dan@radenkovic.org, bogdan@radenkovic.org',
  subject: 'Sample Subject',
  html: '<div>Body of the message</div>',
})
```

And that's it!


## Sending email with variables

Most of the time, you want to include some dynamic data in email subject, or email body.
Mailer module supports templating thanks to [mustache](https://mustache.github.io/):

```
const send = await Mail.send({
  to: 'dan@radenkovic.org',
  subject: 'Hello {{username}}',
  html: '<div>Hi {{firstname}} {{lastname}}</div>',
  variables: {
    username: 'dan',
    firstname: 'Dan',
    lastname: 'Radenkovic'
  }
})
```

This will result sending email with subject `Hello dan`, and body `<div>Hi Dan Radenkovic</div>`.

## Sending email with base template

Often, you want to have consistent header and footer in email, so you design a 
base template, and you inject different messages in it. To send such email, you
just need to pass `baseTemplate` string, which has to include `{{{email_body}}}` (notice that it's wrapped in three curly braces so html does not get escaped) variable,
which will be replaced with parsed `html` of the email. Base template can use passed variables too.


```
const send = await Mail.send({
  to: 'dan@radenkovic.org',
  subject: 'I has template',
  baseTemplate: '<html>from base template I say {{{email_body}}}</html>'
  html: '<div>Hi {{firstname}} {{lastname}}</div>',
  variables: {
    username: 'dan',
    firstname: 'Dan',
    lastname: 'Radenkovic'
  }
})
```

This will result sending email body 
`<html>from base template I say <div>Hi Dan Radenkovic</div></html>`.

## Replacing the renderer

If you want to use more robust template renderer, you can pass renderer function
when instantiating the mailer class:

```
const CustomRenderEmails = new Mailer({
  ... // omitted for clarity
  renderer: (content, variables) => {
    // implement some variable parsing here
    return content // dummy renderer, ignores variables and returns content
  }
})
```

The `renderer` function should accept two arguments: `content` (string with some tags to be replaced), and `variables`,
object with variables and it should return parsed `string`.




