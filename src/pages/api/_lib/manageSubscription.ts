import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'
  //buscar o usuárioo no banco do FaunaDB com o Id {customerId}
  //Salvar os dados da subscription no fauna 
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createdAction = false,
  ) {

    const userRef = await fauna.query(//rertornando o ref(id) do user id do fauna que é igual ao customerId
      q.Select(
        'ref',
        q.Get(
          q.Match(
            q.Index('user_by_stripe_customer_id'),
            customerId
          )
        )
      )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)//buscando todos os dados da subscription

    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    }
    
    if (createdAction) {
      await fauna.query(
        q.Create(
          q.Collection('subscriptions'),
          { data: subscriptionData }
        )
      )
    } else {
        await fauna.query(
          q.Replace(
            q.Select(
              "ref", // "fitrando" o ref(id) do user id do fauna que é igual ao subscriptionId
              q.Get(
                q.Match(
                  q.Index('subscription_by_id'),
                  subscriptionId,
                )
              )
            ),
            { data: subscriptionData }
          )
        )
    }
  }
