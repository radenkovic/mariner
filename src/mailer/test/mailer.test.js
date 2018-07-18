import Mailer from '../index';

const path = `${process.cwd()}/src/mailer/test`;

const mockTransporter = {
  sendMail: data => {
    if (data.fail) throw new Error();
    delete data.variables;
    return data;
  }
};

const MailService = new Mailer({
  templatesDir: path,
  transport: {},
  from: 'dan@radenkovic.org'
});

MailService.transporter = mockTransporter;

test('No configuration', () => {
  expect(() => {
    const M = new Mailer();
    return M;
  }).toThrow();
});

describe('Send function', () => {
  test('Send without sender', () => {
    expect(
      MailService.send({
        html: 'test',
        subject: 'test'
      })
    ).toEqual({
      from: 'dan@radenkovic.org',
      html: 'test',
      subject: 'test'
    });
  });

  test('Send with sender', () => {
    expect(
      MailService.send({
        from: 'dan@radenkovic.org',
        html: 'test',
        subject: 'test'
      })
    ).toEqual({
      from: 'dan@radenkovic.org',
      html: 'test',
      subject: 'test'
    });
  });

  test('Send with variables', () => {
    expect(
      MailService.send({
        from: 'dan@radenkovic.org',
        html: 'test {{id}}',
        subject: 'test {{id}}',
        variables: { id: 1 }
      })
    ).toEqual({
      from: 'dan@radenkovic.org',
      html: 'test 1',
      subject: 'test 1'
    });
  });

  test('Send with baseTemplate', () => {
    expect(
      MailService.send({
        from: 'dan@radenkovic.org',
        html: 'test {{id}}',
        baseTemplate: '<html>{{email_body}}</html>',
        subject: 'test {{id}}',
        variables: { id: 1 }
      })
    ).toHaveProperty('html', '<html>test 1</html>');
  });

  test('Throw without html', () => {
    expect(() => {
      MailService.send({
        subject: '{{subjectVar}}'
      });
    }).toThrow();
  });

  test('Throw without subject', () => {
    expect(() => {
      MailService.send({
        html: '{{subjectVar}}'
      });
    }).toThrow();
  });
});
