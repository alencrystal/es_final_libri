const fastify = require('fastify')({ logger: true }); //avvio server fastify
require('dotenv').config(); //carica variabili d'ambiente

// DB 
fastify.register(require('./plugins/db'));

// Rotte
fastify.register(require('./routes/books'), { prefix: '/books' });

// Avvio server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
