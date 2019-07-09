SET GLOBAL time_zone = '+2:00';

USE camagru;

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS filters;

CREATE TABLE users (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	username		VARCHAR(100)				CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE,
	password		VARCHAR(255)				NOT NULL,
	email		    VARCHAR(100)				NOT NULL UNIQUE,
	type			ENUM('default', 'admin')	NOT NULL DEFAULT 'default',
	verified		BOOLEAN						NOT NULL DEFAULT false,
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
	id				INTEGER						AUTO_INCREMENT,
	token			CHAR(36)					NOT NULL,
	user_id			INTEGER						NOT NULL,
	type			ENUM('SIGN-UP', 'RESET')	NOT NULL,

	PRIMARY KEY (id, token),

	CONSTRAINT fk_tokens_user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id)
);

CREATE TABLE posts (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	user_id	  		INTEGER						NOT NULL,
	img_id    		INTEGER						NOT NULL,
	text      		TEXT						NOT NULL,
	created_at		TIMESTAMP					NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id),
	CONSTRAINT fk_img_id
		FOREIGN KEY (img_id)
		REFERENCES images(id)
);

CREATE TABLE comments (
	comment_id		INTEGER						AUTO_INCREMENT PRIMARY KEY,
	text			TEXT						NOT NULL,
	user_id			INTEGER						NOT NULL,
	post_id			INTEGER						NOT NULL,
	created_at		TIMESTAMP					NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_comments_user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id),
	CONSTRAINT fk_comment_post_id
		FOREIGN KEY (post_id)
		REFERENCES posts(id)
);

CREATE TABLE likes (
	user_id			INTEGER						NOT NULL,
	post_id			INTEGER						NOT NULL,
	liked			BOOLEAN						NOT NULL DEFAULT false,

	PRIMARY KEY (user_id, post_id),
	CONSTRAINT fk_likes_user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id),
	CONSTRAINT fk_likes_post_id
		FOREIGN KEY (post_id)
		REFERENCES posts(id)
);
