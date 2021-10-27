//com o stripe.exe na raiz do projeto, execute o comando >stripe login 
// para tester execute o comando >stripe listen --forward-to localhost:3000/api/webhooks
import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from "stream"
import Stripe from "stripe";
import { stripe } from "../../services/stripe"
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await  (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}//transformando os dados do tipo streaming para q sejam legíveis no código

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'checkout.subscriptions.created',
  'checkout.subscriptions.updated',
  'checkout.subscriptions.deleted',
]);

export default async(req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook error:${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
        try {
          switch(type) {
            case 'customer.subscriptions.created':
            case 'customer.subscriptions.updated':
            case 'customer.subscriptions.deleted':
              const subscription = event.data.object as Stripe.Subscription

              await saveSubscription(
                subscription.id,
                subscription.customer.toString(),
                type === 'customer.subscriptions.created',
              )

              break;
            case 'checkout.session.completed':

              const checkoutSession = event.data.object as Stripe.Checkout.Session

              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString(),
                false
              )

              break;
            default: 
              throw new Error('Unhandled event.')
          }
        } catch (err) {
          return res.json({error: 'Webhook handler failed.'})
        }
    }

    res.json({received: true})
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
 
}