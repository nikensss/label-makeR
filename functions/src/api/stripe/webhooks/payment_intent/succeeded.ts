import { Request } from 'express';
import { logger, config } from 'firebase-functions';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Stripe from 'stripe';
import { getOrder } from '../../../../firestore/orders/orders';

export const onPaymentIntentSucceeded = async (req: Request): Promise<void> => {
  try {
    const paymentIntent = req.body.data.object as Stripe.PaymentIntent;
    const { email } = paymentIntent.charges.data[0].billing_details;

    const order = await getOrder(paymentIntent.id);
    if (!order) throw new Error(`Unknown order ${paymentIntent.id}`);

    const labels = order.getLabels();
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
      html: '<h1>Testing mailgun</h1>This is a test with mailgun. If you received this, consider yourself lucky enought that we are confident to test with you.',
      attachment: await Promise.all(labels.map((l, i) => l.asAttachement(i)))
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
