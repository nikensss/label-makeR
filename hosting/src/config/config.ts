const prod = {
  orderCheck: 'https://europe-west3-label-maker-app.cloudfunctions.net/api/order/check'
};

const dev = {
  orderCheck: 'http://localhost:5001/label-maker-app/europe-west3/api/order/check'
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
