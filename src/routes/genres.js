async function genreRoutes(fastify, options) {
  // GET /genres - Recupera tutti i generi
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await fastify.mysql.query('SELECT * FROM genres');
      return rows;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore nel recupero dei generi' });
    }
  });

  // GET /genres/:id - Recupera un genere specifico
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const [rows] = await fastify.mysql.query('SELECT * FROM genres WHERE id = ?', [id]);

      if (rows.length === 0) {
        return reply.code(404).send({ error: 'Genere non trovato' });
      }

      return rows[0];
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore nel recupero del genere' });
    }
  });

  // POST /genres - Crea un nuovo genere
  fastify.post('/', async (request, reply) => {
    const { nome } = request.body;

    if (!nome) {
      return reply.code(400).send({ error: 'Il campo nome è obbligatorio' });
    }

    try {
      const [result] = await fastify.mysql.query(
        'INSERT INTO genres (nome) VALUES (?)',
        [nome]
      );

      return reply.code(201).send({
        id: result.insertId,
        nome
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante la creazione del genere' });
    }
  });

  // PUT /genres/:id - Aggiorna un genere
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params;
    const { nome } = request.body;

    if (!nome) {
      return reply.code(400).send({ error: 'Il campo nome è obbligatorio' });
    }

    try {
      const [result] = await fastify.mysql.query(
        'UPDATE genres SET nome = ? WHERE id = ?',
        [nome, id]
      );

      if (result.affectedRows === 0) {
        return reply.code(404).send({ error: 'Genere non trovato' });
      }

      return { id: parseInt(id), nome };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante l\'aggiornamento del genere' });
    }
  });

  // DELETE /genres/:id - Elimina un genere
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const [result] = await fastify.mysql.query('DELETE FROM genres WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return reply.code(404).send({ error: 'Genere non trovato' });
      }

      return { message: 'Genere eliminato con successo' };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante l\'eliminazione del genere' });
    }
  });

// GET /genres/books/:id - Recupera i libri di un genere specifico in base all'ID
  fastify.get('/books/:id', async (request, reply) => {
    const { id } = request.params;

    try {
        const [rows] = await fastify.mysql.query(
        `
        SELECT 
          books.id, 
          books.titolo, 
          books.anno, 
          authors.nome AS autore,
          genres.nome AS genere
        FROM books
        JOIN authors ON books.autore_id = authors.id
        JOIN genres ON books.genere_id = genres.id
        WHERE books.genere_id = ?
        `,
        [id]
        );

        if (rows.length === 0) {
        return reply.code(404).send({ error: 'Nessun libro trovato per questo genere' });
        }

        return rows;
    } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante il recupero dei libri del genere' });
    }
    });


// GET /genres/search/:query - Cerca per nome anche in modo parziale nei generi
  fastify.get('/search/:query', async (request, reply) => {
    const { query } = request.params;

    try {
      const [rows] = await fastify.mysql.query(
        `SELECT * FROM genres WHERE nome LIKE ?`, [`%${query}%`]
      );
      reply.send(rows);
    } catch (err) {
      fastify.log.error(err); 
      reply.status(500).send({ error: 'Errore durante la ricerca' });
    }
  });

}

module.exports = genreRoutes;
