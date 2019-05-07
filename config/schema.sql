USE camagru;

CREATE TABLE users (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	username		VARCHAR(100)				NOT NULL UNIQUE,
	password		VARCHAR(255)				NOT NULL,
	email		    VARCHAR(100)				NOT NULL UNIQUE,
	type			ENUM('default', 'admin')	NOT NULL DEFAULT 'default',
	created_at		TIMESTAMP					NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
	id				INTEGER						AUTO_INCREMENT PRIMARY KEY,
	url				VARCHAR(255)				NOT NULL
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
