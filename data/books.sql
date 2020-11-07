DROP TABLE if exists books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    isbn VARCHAR(255),
    image VARCHAR(255)
);