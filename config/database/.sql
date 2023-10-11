CREATE TABLE chatbotType (
	id INT AUTO_INCREMENT,
	title VARCHAR (100) NOT NULL,
	defaultMessage VARCHAR(100) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO
	chatbotType(title, defaultMessage)
VALUES
	("Queja", "Cuentame tu queja"),
	("Reclamo", "Que sucede"),
	("Peticion", "Que necesitas"),
	("Satisfaccion", "Cool");

CREATE TABLE statusType (
	id INT AUTO_INCREMENT,
	statusName VARCHAR (30) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE chatbotConfig (
	id INT AUTO_INCREMENT,
	question VARCHAR(70) NOT NULL,
	response VARCHAR(70) NOT NULL,
	typeId INT,
	PRIMARY KEY(id),
	CONSTRAINT FOREIGN KEY (typeId) REFERENCES chatbotType(id)
);

INSERT INTO
	chatbotconfig(question, response, typeId)
VALUES
	(
		'Como comprar',
		"Dirigete a la tienda o a nuestro sitio web",
		3
	);

CREATE TABLE user (
	id INT AUTO_INCREMENT,
	name VARCHAR (20) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE userConversation (
	id INT AUTO_INCREMENT,
	userChat VARCHAR(500) NOT NULL,
	botChat VARCHAR (500) NOT NULL,
	statusId INT,
	typeId INT,
	userId INT,
	CONSTRAINT FOREIGN KEY (userId) REFERENCES user(id),
	CONSTRAINT FOREIGN KEY (statusId) REFERENCES statusType(id),
	CONSTRAINT FOREIGN KEY (typeId) REFERENCES chatbotType(id),
	PRIMARY KEY(id)
);