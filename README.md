## 📖 Struttura di un libro

```json
{
  "id": 1,
  "titolo": "Come invadere la Polonia in 3 passaggi",
  "autore": "Larry the Cat",
  "anno": 1939,
  "genere": "Documentario storico"
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

Esegui il file `init.sql` per creare il database `books_db` e la tabella `books`:

```bash
mysql -u tuo_utente -p < init.sql
```

Assicurati che MySQL sia in esecuzione.

### 5. Avvia il server

```bash
npm run dev
```

### 6. (Opzionale) Popola il database con il seeder

```bash
npm run seed
```

L'app sarà disponibile all'indirizzo:
[http://localhost:3000](http://localhost:3000)

---


