import { Handler } from '@netlify/functions'
import axios from 'axios'

// process.env.APIKEY
// process.env.USERNAME
const {APIKEY, USERNAME} = process.env

const handler: Handler = async event => { //handler는 넷리파이에서 요구하는 이름임!
  const {id, method, data} = JSON.parse(event.body as string)
  const { data: returnValue } = await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`,
    method,
    headers: {
      'content-type': 'application/json',
      'apikey': APIKEY as string,
      'username': USERNAME as string
    },
    data
  })
  return {
    statusCode: 200,
    body: JSON.stringify(returnValue)
  }
}
export { handler }
