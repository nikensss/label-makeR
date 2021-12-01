import { Request } from 'express';
import { logger } from 'firebase-functions';

export const onPaymentIntentSucceeded = async (req: Request): Promise<void> => {
  const paymentIntent = req.body.data.object;
  const { email } = paymentIntent.charges.data[0].billing_details;
  logger.info(`Sending email to ${email} for successful payment of ${paymentIntent.id}...`);
};
