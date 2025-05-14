async function authorRoutes(fastify, options) {
  // GET /authors - Recupera tutti gli authors
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await fastify.mysql.query('SELECT * FROM authors');
      return rows;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore nel recupero degli autori' });
    }
  });

  // GET /authors/:id - Recupera un autore specifico
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const [rows] = await fastify.mysql.query('SELECT * FROM authors WHERE id = ?', [id]);

      if (rows.length === 0) {
        return reply.code(404).send({ error: 'Autore non trovato' });
      }

      return rows[0];
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore nel recupero dell\'autore' });
    }
  });

  // POST /authors - Crea un nuovo autore
  fastify.post('/', async (request, reply) => {
    const { nome } = request.body;

    if (!nome) {
      return reply.code(400).send({ error: 'Il campo nome è obbligatorio' });
    }

    try {
      const [result] = await fastify.mysql.query(
        'INSERT INTO authors (nome) VALUES (?)',
        [nome]
      );

      return reply.code(201).send({
        id: result.insertId,
        nome
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante la creazione dell\'autore' });
    }
  });

  // PUT /authors/:id - Aggiorna un autore
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params;
    const { nome } = request.body;

    if (!nome) {
      return reply.code(400).send({ error: 'Il campo nome è obbligatorio' });
    }

    try {
      const [result] = await fastify.mysql.query(
        'UPDATE authors SET nome = ? WHERE id = ?',
        [nome, id]
      );

      if (result.affectedRows === 0) {
        return reply.code(404).send({ error: 'Autore non trovato' });
      }

      return { id: parseInt(id), nome };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante l\'aggiornamento dell\'autore' });
    }
  });

  // DELETE /authors/:id - Elimina un autore
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const [result] = await fastify.mysql.query('DELETE FROM authors WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return reply.code(404).send({ error: 'Autore non trovato' });
      }

      return { message: 'Autore eliminato con successo' };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Errore durante l\'eliminazione dell\'autore' });
    }
  });

  // GET /authors/books/:id - Recupera i libri di un autore specifico
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
        WHERE books.autore_id = ?
        `,
        [id]
        );

        if (rows.length === 0) {
        return reply.code(404).send({ error: 'Nessun libro trovato per questo autore' });
        }

        return rows;
    } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante il recupero dei libri dell\'autore' });
    }
    });

}

module.exports = authorRoutes;
