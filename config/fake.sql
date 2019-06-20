USE camagru;

INSERT INTO users (username, password, email) VALUES
    ('Shakespeare', '$2y$10$pcw4JiCafsytCU8n8beB4edycWD6SgSDqZG5qFnUQeYuazcgu9yUK', 'test@example.fr'), -- password is 'Hamlet'
    ('Racine', '$2y$10$3r0VbsUo/hJTmzNId0ZbBuoUYfl.Dpr2oAqJLjKo92y/w1Iij78PG', 'coucou@example.fr'); -- password is 'Andromaque'

INSERT INTO filters (path, name, width, height) VALUES
    ('vuejs.png', 'Vue.js', 200, 200);

