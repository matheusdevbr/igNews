import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"

import { query as q } from "faunadb"
import { fauna } from "../../services/fauna"
import { stripe } from "../../services/stripe"

type User = {
  ref: {
    id: string;
  }
  data: { 
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getSession({ req })//busca o usuario logado

    const user = await fauna.query<User>( //retorna o usuario no db que deu match com o usuario logado
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({ //cria um novo customer adicionando o email do usuario logado
        email: session.user.email,
      })

      await fauna.query( //atualiza adicionando no db do usuario logado o id do stripe
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: { 
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }
    

    

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1JjsnYIh8KD75JRODZSaVsJa', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}