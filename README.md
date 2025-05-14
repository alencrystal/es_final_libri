## Struttura di un libro, di un autore e del genere

```json
{
  "id": 1,
  "titolo": "Come aprire una porta in 3 passaggi",
  "autore_id": 1,
  "anno": 1969,
  "genere_id": 1
}

{
  "id": 1,
  "nome": "Larry the Cat"
}

{
  "id": 1,
  "nome": "Fantasy"
}
````

---

## Setup locale

### 1. Clona il repository

```bash
git clone https://github.com/alencrystal/es_final_libri.git
cd es_final_libri
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Crea il file `.env` per la configurazione

Copia il file `.env.example` e rinominalo in `.env`:

```bash
cp .env.example .env
```

Modifica i valori al suo interno con le tue credenziali MySQL:

```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=books_db
DB_PORT=3306
PORT=3000
```

### 4. Crea il database e la tabella

Esegui il file `init.sql` per creare il database `books_db` e le tabelle `books` `authors` `genres`:

```bash
npm run init-db
```

Assicurati che MySQL sia in esecuzione.

### 5. Avvia il server

```bash
npm run dev
```

### 6. (non funzionante in questo momento) Popola il database con il seeder 

```bash
npm run seed
```

L'app sarà disponibile all'indirizzo:
[http://localhost:3000](http://localhost:3000)

---


