const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51OlZQPSBWvNiDgPdQdk83G4yYOQKw1JvozL1JSHT3aez2ILQi3HXvtB4x4AxHsS4pbZrA2GqYjnxPJhGdYaPrMdL00YqrgNbOB');

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Year Card',
        },
        unit_amount: 44900,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://yourwebsite.com/success',
    cancel_url: 'https://yourwebsite.com/cancel',
  });

  res.json({ id: session.id });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
