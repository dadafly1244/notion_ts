import isbot from 'https://cdn.skypack.dev/isbot'
import { Context } from 'netlify:edge'  //설치를 안해서 에러가 나는 것처럼 보임!! deno 확장프로그램 설치함..!ㄴ

const APIKEY = Deno.env.get('APIKEY') as string
const USERNAME = Deno.env.get('USERNAME') as string
const PUBLIC_URl = Deno.env.get('PUBLIC_URl') as string


export default async (request: Request, context: Context) => {  
  console.log('user-agent::', request.headers.get('user-agent'))
  console.log('request.url::', request.url)

  // const userAgent = request.headers.get('user-agent')
  // const id = request.url.split('/').filter(p=> p).reverse()[0]

  // if (isbot(userAgent)) {
  //   //봇은... 나가!! 메타정보만 가져가!!
  //   console.log('BOT!')
  //   const res =  await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`,{
  //     method: 'GET',
  //     headers: {
  //       'content-type': 'application/json',
  //       'apikey': APIKEY,
  //       'username': USERNAME
  //     },
  //   })
  //   const {title, content, poster} = await res.json()
  
  const userAgent = request.headers.get('user-agent')
  const id = request.url.split('/').filter( p => p).reverse()[0]

  if (isbot(userAgent)) {
    console.log('Bot!!')
    const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`,{
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'apikey': APIKEY,
        'username': USERNAME
      },
    })
    const {title, content, poster} = await res.json()
    
    return new Response(/*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <!-- 크롤링 봇은 link 태그는 필요 없으!! -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Heropy's Notion</title>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Notion Clone" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${content}" />
          <meta property="og:image" content="${poster}" />
          <meta property="og:url" content="${PUBLIC_URl}/workspaces/${id}" />

          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content="Notion Clone!" />
          <meta property="twitter:title" content="${title}" />
          <meta property="twitter:description" content="${content}" />
          <meta property="twitter:image" content="${poster}" />
          <meta property="twitter:url" content="${PUBLIC_URl}/workspaces/${id}" />
          
        </head>
        <body></body>
      </html>`, {
        headers: {'content-type': 'text/html; charset=utf-8'}
      })//html 첫번째 변수 , 2번째 인수 응답해더
  }

  return await context.next()
}

// 일반 사용자는 index.html로 넘기기 
// 봇은 팅기기!! 
