import * as functions from 'firebase-functions';

export interface IConfig {
  stripe: {
    api_key: string;
    webhooks_signing_key: string;
    success_url: string;
    cancel_url: string;
  };
  env: {
    is_dev: boolean;
  };
}

const functionsConfig = functions.config();
export const config: IConfig = {
  stripe: {
    api_key: functionsConfig.stripe?.api_key || '',
    webhooks_signing_key: functionsConfig.stripe?.webhooks_signing_key || '',
    success_url: functionsConfig.stripe?.success_url || 'http://localhost:3000/thankyou',
    cancel_url: functionsConfig.stripe?.cancel_url || 'http://localhost:3000/cancel'
  },
  env: {
    is_dev: functionsConfig.env?.is_dev === 'true'
  }
};
