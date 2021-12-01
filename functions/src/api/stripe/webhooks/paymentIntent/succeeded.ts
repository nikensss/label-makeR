import { Request } from 'express';
import { logger, config } from 'firebase-functions';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export const onPaymentIntentSucceeded = async (req: Request): Promise<void> => {
  try {
    const paymentIntent = req.body.data.object;
    const { email } = paymentIntent.charges.data[0].billing_details;

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: config().mailgun.api_key,
      url: 'https://api.eu.mailgun.net'
    });

    await mg.messages.create(config().mailgun.domain_name, {
      from: 'Label Maker <label.maker@rmallafre.dev>',
      to: [email],
      subject: 'Thank you for your purchase',
      text: 'Testing mailgun',
      html: '<h1>Testing mailgun</h1>This is a test with mailgun. If you received this, consider yourself lucky enought that we are confident to test with you. 😉'
    });
    logger.info(`Email sent to ${email} for successful payment of ${paymentIntent.id}`);
  } catch (ex) {
    const error = toJsonError(ex);
    logger.error('error!', { error });
  }
};

const toJsonError = (e: unknown) => {
  const message = e instanceof Error ? e.message : `${e}`;
  const name = e instanceof Error ? e.name : 'Error';
  const stack = e instanceof Error ? e.stack : new Error().stack;

  return { message, name, stack };
};
