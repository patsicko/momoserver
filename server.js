const express = require('express');
const { makeRequest } = require('mtn-momo-api');
const cors = require('cors');

const stripe_public_key = 'pk_test_51ObikEGT2Rq02fmKeeIZTWr0kILcXD4B7vXRRABhY93DiAF0a4jXTKLHrOqc4yT1dH5bbNUphiwdt3cOID03b6nr006SKdUlFU'
const stripe_secret_key='sk_test_51ObikEGT2Rq02fmKl8YDiezRNNw8lyACyRyFNnS1ITx6aD1oFKL8ZgIXeFFPpeXovz3by2jqBGH8pEYSB6oOkkrm002dR9pgX9'
const stripe = require('stripe')(stripe_secret_key);
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const userApiKey = '0565ce0d89234aa69079897fa3b376f7';
const userId = 'd3616336-2e7a-42b5-bcc5-2375d56dd189';
const primaryKey = 'e83862b0343c43f7a1caa957ebf8d32b';

app.use(express.json());
app.use(cors());




app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});


app.post('/momo-pay', async (req, res) => {
  console.log('Request received at /momo-pay');
  try {
    const clientData = req.body;

    const momoPayResponse = await makeRequest({
      callbackHost: 'http://localhost:3000/callback-endpoint', 
      userApiKey,
      userId,
      primaryKey,
      amount: clientData.amount,
      currency: clientData.currency,
      externalId: clientData.externalId,
      partyIdType: clientData.partyIdType,
      partyId: clientData.partyId,
      payerMessage: clientData.payerMessage,
      payeeNote: clientData.payeeNote,
      payee: {
        partyIdType: clientData.payeePartyIdType, 
        partyId: clientData.payeePartyId, 
      },
    });
    console.log("data",momoPayResponse)
    
    res.json({ success: true, data: momoPayResponse });
    
    
  } catch (error) {
    console.error('MomoPay Error:', error);
    res.status(500).json({ success: false, error: 'MomoPay failed' });
  }
});


app.post('/callback-endpoint', (req, res) => {

  const callbackData = req.body;
  console.log('Received Callback:', callbackData);

  res.status(200).send('Callback received successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



