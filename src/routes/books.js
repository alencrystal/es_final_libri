async function routes(fastify, options) {
    // GET /books 
  // fastify.get('/', async (request, reply) => {
  //     try {
  //       const [rows] = await fastify.mysql.query(`
  //         SELECT 
  //           books.id,
  //           books.titolo,
  //           books.anno,
  //           authors.nome AS autore,
  //           genres.nome AS genere
  //         FROM books
  //         JOIN authors ON books.autore_id = authors.id
  //         JOIN genres ON books.genere_id = genres.id
  //       `);

  //       return rows;
  //     } catch (err) {
  //       fastify.log.error(err);
  //       return reply.code(500).send({ error: 'Errore durante il recupero dei libri' });
  //     }
  //   });

  
    // GET /books/:id
    fastify.get('/:id', async (request, reply) => {
      const { id } = request.params;
  
      try {
        const [rows] = await fastify.mysql.query(`SELECT 
            books.id,
            books.titolo,
            books.anno,
            authors.nome AS autore,
            genres.nome AS genere
          FROM books
          JOIN authors ON books.autore_id = authors.id
          JOIN genres ON books.genere_id = genres.id WHERE books.id = ?`, [id]);
  
        if (rows.length === 0) {
          return reply.code(404).send({ error: 'Libro non trovato' });
        }
  
        return rows[0];
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: 'Errore durante la ricerca del libro' });
      }
    });
  
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


// GET /books/:query --search fatto bene con params in modo da filtrare decentemente

//esempio http://localhost:3000/books?idaut=2&title=come
fastify.get('/', async (request, reply) => {
  const { id, title, idgen, idaut, year } = request.query;

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
      WHERE 1 = 1
    `;

    //1 = 1 serve in caso non si mettano filtri restituisce tutti i libri

    const values = [];

    if (id) {
      sql += ` AND books.id = ?`;
      values.push(parseInt(id));
    }

    if (title) {
      sql += ` AND books.titolo LIKE ?`;
      values.push(`%${title}%`);
    }

    if (idgen) {
      sql += ` AND books.genere_id = ?`;
      values.push(parseInt(idgen));
    }

    if (idaut) {
      sql += ` AND books.autore_id = ?`;
      values.push(parseInt(idaut));
    }

    if (year) {
      sql += ` AND books.anno = ?`;
      values.push(parseInt(year));
    }

    const [rows] = await fastify.mysql.query(sql, values);
    reply.send(rows);

  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Errore durante la ricerca dei libri' });
  }
});



}

  
  module.exports = routes;
  

  // 200 è andato a buon fine
  // 201 è stato creato
  // 404 non trovato
  // 500 errore del server