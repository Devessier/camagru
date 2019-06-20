USE camagru;

DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS filters;

CREATE TABLE users (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	username		VARCHAR(100)				NOT NULL UNIQUE,
	password		VARCHAR(255)				NOT NULL,
	email		    VARCHAR(100)				NOT NULL UNIQUE,
	type			ENUM('default', 'admin')	NOT NULL DEFAULT 'default',
	created_at		TIMESTAMP					NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE filters (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	path			VARCHAR(255)				NOT NULL,
	name			VARCHAR(255)				NOT NULL,
	width			INTEGER						NOT NULL,
	height			INTEGER						NOT NULL
);

CREATE TABLE images (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	path			VARCHAR(255)				NOT NULL
);

CREATE TABLE tokens (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	token			VARCHAR(255)				NOT NULL
);

CREATE TABLE posts (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	user_id	  		INTEGER						NOT NULL,
	img_id    		INTEGER						NOT NULL,
	text      		TEXT						NULL,

	CONSTRAINT fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id),
	CONSTRAINT fk_img_id
		FOREIGN KEY (img_id)
		REFERENCES images(id)
);
