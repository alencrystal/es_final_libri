CREATE DATABASE IF NOT EXISTS books_db;
USE books_db;

-- Tabella degli autori
CREATE TABLE IF NOT EXISTS autori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Tabella dei generi
CREATE TABLE IF NOT EXISTS generi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

--bisogna aggiungere prima generi e autori, altrimenti i riferimenti non funzionano

-- Tabella dei libri
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titolo VARCHAR(255) NOT NULL,
  autore_id INT NOT NULL,
  anno INT NOT NULL,
  genere_id INT NOT NULL,
  FOREIGN KEY (autore_id) REFERENCES autori(id) ON DELETE SET NULL, --se un autore viene eliminato, il suo id diventa 0, quindi il libro rimane
  FOREIGN KEY (genere_id) REFERENCES generi(id) ON DELETE SET NULL
);

