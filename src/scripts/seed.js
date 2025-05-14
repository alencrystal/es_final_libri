const axios = require('axios');

//axios serve per fare richieste http (tipo post, get, etc)

const books = [
  {
    titolo: "1984",
    autore: "George Orwell",
    anno: 1949,
    genere: "Distopia"
  },
  {
    titolo: "Il Signore degli Anelli",
    autore: "J.R.R. Tolkien",
    anno: 1954,
    genere: "Fantasy"
  },
  {
    titolo: "Cronache marziane",
    autore: "Ray Bradbury",
    anno: 1950,
    genere: "Fantascienza"
  }
];

async function seed() {
  for (const book of books) {
    try {
      const res = await axios.post('http://localhost:3000/books', book);
      console.log(`✅ Inserito: ${res.data.titolo}`);
    } catch (err) {
      console.error('❌ Errore:', err.response?.data || err.message);
    }
  }
}

seed();

//da rifare tutto