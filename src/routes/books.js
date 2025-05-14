async function routes(fastify, options) {
    // GET /books 
  fastify.get('/', async (request, reply) => {
      try {
        const [rows] = await fastify.mysql.query(`
          SELECT 
            books.id,
            books.titolo,
            books.anno,
            authors.nome AS autore,
            genres.nome AS genere
          FROM books
          JOIN authors ON books.autore_id = authors.id
          JOIN genres ON books.genere_id = genres.id
        `);

        return rows;
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante il recupero dei libri' });
      }
    });

  
    // GET /books/:id
    // fastify.get('/:id', async (request, reply) => {
    //   const { id } = request.params;
  
    //   try {
    //     const [rows] = await fastify.mysql.query(`SELECT 
    //         books.id,
    //         books.titolo,
    //         books.anno,
    //         authors.nome AS autore,
    //         genres.nome AS genere
    //       FROM books
    //       JOIN authors ON books.autore_id = authors.id
    //       JOIN genres ON books.genere_id = genres.id WHERE id = ?`, [id]);
  
    //     if (rows.length === 0) {
    //       return reply.code(404).send({ error: 'Libro non trovato' });
    //     }
  
    //     return rows[0];
    //   } catch (err) {
    //     fastify.log.error(err);
    //     return reply.code(500).send({ error: 'Errore durante la ricerca del libro' });
    //   }
    // });
  
    // POST /books
    fastify.post('/', async (request, reply) => {
      const { titolo, autore_id, anno, genere_id } = request.body;
  
      if (!titolo || !autore_id || !anno || !genere_id) {
        return reply.code(400).send({ error: 'Tutti i campi sono obbligatori' });
      }
  
      try {
        const [result] = await fastify.mysql.query(
          'INSERT INTO books (titolo, autore_id, anno, genere_id) VALUES (?, ?, ?, ?)',
          [titolo, autore_id, anno, genere_id]
        );
  
        const newBook = {
          id: result.insertId,
          titolo,
          autore_id,
          anno,
          genere_id
        };
  
        return reply.code(201).send(newBook);
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante l\'inserimento del libro' });
      }
    });
  
    // PUT /books/:id
    fastify.put('/:id', async (request, reply) => {
      const { id } = request.params;
      const { titolo, autore_id, anno, genere_id } = request.body;
  
      try {
        const [result] = await fastify.mysql.query(
          'UPDATE books SET titolo = ?, autore_id = ?, anno = ?, genere_id = ? WHERE id = ?',
          [titolo, autore_id, anno, genere_id, id]
        );
  
        if (result.affectedRows === 0) {
          return reply.code(404).send({ error: 'Libro non trovato' });
        }
  
        return {
          id: parseInt(id),
          titolo,
          autore_id,
          anno,
          genere_id
        };
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante l\'aggiornamento del libro' });
      }
    });
  
    // DELETE /books/:id
    fastify.delete('/:id', async (request, reply) => {
      const { id } = request.params;
  
      try {
        const [result] = await fastify.mysql.query('DELETE FROM books WHERE id = ?', [id]);
  
        if (result.affectedRows === 0) {
          return reply.code(404).send({ error: 'Libro non trovato' });
        }
  
        return { message: 'Libro eliminato con successo' };
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante l\'eliminazione del libro' });
      }
    });

    
//


// GET /books/:query --search tramite ID o parola contenuta nel libro
fastify.get('/:query', async (request, reply) => {
  const { query } = request.params;
  const isNumeric = /^\d+$/.test(query); // Verifica se è un intero con un controllo regex (.test restituisce un bool)

  try {
    let sql = `
      SELECT
        books.id, 
        books.titolo, 
        books.anno, 
        authors.nome AS autore,
        genres.nome AS genere
      FROM books
      JOIN authors ON books.autore_id = authors.id
      JOIN genres ON books.genere_id = genres.id
      WHERE books.titolo LIKE ?
    `;

    const values = [`%${query}%`];

    if (isNumeric) {
      sql += ` OR books.id = ?`;
      values.push(parseInt(query));
    }

    const [rows] = await fastify.mysql.query(sql, values);
    reply.send(rows);

  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Errore durante la ricerca' });
  }
});


}

  
  module.exports = routes;
  

  // 200 è andato a buon fine
  // 201 è stato creato
  // 404 non trovato
  // 500 errore del server