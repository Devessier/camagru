USE camagru;

-- Delete the use of the SHA1 method

INSERT INTO users (username, password, email) VALUES ('Shakespeare', SHA1('Hamlet'), 'test@example.fr');
INSERT INTO users (username, password, email) VALUES ('Racine', SHA1('Andromaque'), 'coucou@example.fr');


