import * as functions from 'firebase-functions';

const functionsConfig = functions.config();

export const config = {
  stripe: {
    api_key: functionsConfig.stripe.api_key || '',
    success_url: functionsConfig.stripe.success_url || 'http://localhost:3000/thankyou',
    cancel_url: functionsConfig.stripe.cancel_url || 'http://localhost:3000/cancel'
  },
  env: {
    is_dev: functionsConfig.env.is_dev === 'true'
  }
};
