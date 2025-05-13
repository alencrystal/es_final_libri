// src/plugins/db.js
const fastifyPlugin = require('fastify-plugin');
const mysql = require('mysql2/promise');

async function dbConnector(fastify, options) {
  const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  fastify.decorate('mysql', connection); //Questo rende il pool accessibile in tutte le rotte con fastify.mysql.
}

module.exports = fastifyPlugin(dbConnector); //Permette a Fastify di gestire l'ordine di caricamento dei plugin.
