# es_final_libri

Ogni libro ha la seguente struttura:

```json
{
  "id": 1,
  "titolo": "Come invadere la Polonia in 3 passaggi",
  "autore": "Larry the Cat",
  "anno": 1939,
  "genere": "Documentario storico"
}

Setup locale

##  1. Clona il repository

```bash
git clone https://github.com/tuo-utente/nome-repo.git
cd nome-repo

##  2. Installa le dipendenze

npm install


##  3. crea un file .env copiando e compilando l'example

cp .env.example .env

*Apri .env e inserisci le tue credenziali MySQL*

DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=books_db
PORT=3000
DB_PORT=3306

##  4. lancia questo comando per creare la tabella dei libri secondo lo script init.sql

mysql -u tuo_utente -p < init.sql



##  5. Avvia l'app

npm run dev

//a quel punto sarà disponibile su http://localhost:3000
