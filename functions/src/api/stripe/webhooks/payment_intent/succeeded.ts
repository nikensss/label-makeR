import { AxiosError } from 'axios';
import { Request } from 'express';
import { logger } from 'firebase-functions';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Stripe from 'stripe';
import { config } from '../../../../config/config';
import { getOrder } from '../../../../firestore/orders/orders';

export const onPaymentIntentSucceeded = async (req: Request): Promise<void> => {
  logger.info('Processing payment_intent.succeeded webhook');
  try {
    const paymentIntent = req.body.data.object as Stripe.PaymentIntent;
    const { email } = paymentIntent.charges.data[0].billing_details;

    const order = await getOrder(paymentIntent.id);
    if (!order) throw new Error(`Unknown order ${paymentIntent.id}`);

    const labels = order.getLabels();
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: config.mailgun.api_key,
      url: 'https://api.eu.mailgun.net'
    });

    await mg.messages.create(config.mailgun.domain_name, {
      from: 'Label Maker <label.maker@rmallafre.dev>',
      to: [email],
      subject: 'Thank you for your purchase',
      text: 'Testing mailgun',
      html: await order.asHtml(),
      attachment: await Promise.all(labels.map((l, i) => l.asMailgunAttachement(i)))
    });
    logger.info(`Email sent to ${email} for successful payment of ${paymentIntent.id}`);
  } catch (ex) {
    const error = toJsonError(ex);
    if (isAxiosError(ex)) {
      Object.assign(error, { request: ex.request, response: ex.response });
    }
    logger.error('Could not process payment_intent.succeeded webhook', { error });
  }
};

const isAxiosError = (e: unknown): e is AxiosError => {
  return (e as { isAxiosError: boolean }).isAxiosError === true;
};

const toJsonError = (e: unknown) => {
  const message = e instanceof Error ? e.message : `${e}`;
  const name = e instanceof Error ? e.name : 'Error';
  const stack = e instanceof Error ? e.stack : new Error().stack;

  return { message, name, stack };
};
