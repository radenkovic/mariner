import Mailer from '../index';

const path = `${process.cwd()}/src/mailer/test`;

const mockTransporter = {
  sendMail: data => {
    if (data.fail) throw new Error();
    return data;
  }
};

const MailService = new Mailer({
  templatesDir: path,
  transport: {}
});

MailService.transporter = mockTransporter;

test('Template directory', () => {
  expect(MailService.templatesDir).toBe(path);
});

test('Send', () => {
  expect(MailService.send({ id: 1 })).toEqual({ id: 1 });
});

test('Send from template', () => {
  const res = MailService.sendTemplate('mock-template', {
    subject: '{{subjectVar}}',
    variables: { test: 'sample', subjectVar: 'yo' }
  });
  expect(res).toHaveProperty('subject', 'yo');
  expect(res).toHaveProperty('html', '<div>sample</div>');
});

test('Send from template throw', () => {
  expect(() => {
    MailService.sendTemplate('mock-template', {
      subject: '{{subjectVar}}',
      fail: true,
      variables: { test: 'sample', subjectVar: 'yo' }
    });
  }).toThrow();
});
