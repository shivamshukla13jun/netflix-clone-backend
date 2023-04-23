var Publishable_Key = 'pk_test_51LgPb5SIRFCHSWcUe9ZquKjFj8XX6A2ePN1tC6lRAxhz1YWPV6kQG9MSQKb2AjBLrewNyqk6LqQQ980oc7J7MjNz00pcen77ai'
var Secret_Key ='sk_test_51LgPb5SIRFCHSWcUUnZybwZWBm1qSS5Hhr5u4ekJCyChoALSCEtIpkPCu1lPZBhLUFtcphbHp4kJFGcRVHzCNSYO00utiVMAN9'
 
const stripe = require('stripe')(Secret_Key); // Replace with your own API key

function capturePaymentDetails(req, res, next) {
  // Extract the relevant information from the Stripe request object
  const { id, amount, currency, status } = req.body.data.object;
  const data=
    {
        body:{data:object}
    }
  
  // Log the payment details
  console.log(`Payment received: ${amount} ${currency} (ID: ${id}, Status: ${status})`);
  next();
}
// Apply the middleware to the appropriate route
app.post('/stripe-webhook', capturePaymentDetails, (req, res) => {
  res.status(200).send();
});
