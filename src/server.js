const Hapi = require('@hapi/hapi')
const routes = require('./routes')
 
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
  })

  server.route(routes)

  await server.start()
}
 
init()