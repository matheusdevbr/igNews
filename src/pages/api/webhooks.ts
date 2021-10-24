//com o stripe.exe na raiz do projeto, execute o comando >stripe login 
// para tester execute o comando >stripe listen --forward-to localhost:3000/api/webhooks
import { NextApiRequest, NextApiResponse } from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('evento recebido')

  res.status(200).json({ok: true})
}