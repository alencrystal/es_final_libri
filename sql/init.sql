-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS books_db;
USE books_db;

-- Tabella degli autori
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Tabella dei generi
CREATE TABLE IF NOT EXISTS genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- È importante creare prima authors e genres perché books ha chiavi esterne

-- Tabella dei libri
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titolo VARCHAR(255) NOT NULL,
  autore_id INT NOT NULL,
  anno INT NOT NULL,
  genere_id INT NOT NULL,
  FOREIGN KEY (autore_id) REFERENCES authors(id) ON DELETE NO ACTION, --non cancella i libri se vengono cancellati gli autori
  FOREIGN KEY (genere_id) REFERENCES genres(id) ON DELETE NO ACTION
);

