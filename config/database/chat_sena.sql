CREATE DATABASE chat_sena;

USE chat_sena;

CREATE TABLE chatbotType (
	id INT AUTO_INCREMENT,
	title VARCHAR (100) NOT NULL,
	defaultMessage VARCHAR(100),
	PRIMARY KEY (id)
);

INSERT INTO
	chatbotType(title, defaultMessage)
VALUES
	("QUEJAS", null),
	("RECLAMOS", null),
	("PETICIONES", null),
	("SUGERENCIAS", "¡Genial!");

CREATE TABLE chatbotConfig (
	id INT AUTO_INCREMENT,
	question VARCHAR(70) NOT NULL,
	typeId INT,
	PRIMARY KEY(id),
	CONSTRAINT FOREIGN KEY (typeId) REFERENCES chatbotType(id)
);

CREATE TABLE responseTitle (
	id INT AUTO_INCREMENT,
	title VARCHAR (200) NOT NULL,
	endTitle VARCHAR (200) NOT NULL,
	useRedirect INT (0) DEFAULT 0,
	PRIMARY KEY (id)
);

CREATE TABLE response (
	id INT AUTO_INCREMENT,
	responseContent VARCHAR (500),
	isTree INT(1) DEFAULT 0,
	treeId INT,
	questionId INT,
	isHTML INT(1) DEFAULT 0,
	isMainTree INT(1) DEFAULT 0,
	requiresUserInput INT(1) DEFAULT 0,
	responseTitleId INT,
	CONSTRAINT FOREIGN KEY (treeId) REFERENCES response (id) ON DELETE
	SET
		NULL,
		CONSTRAINT FOREIGN KEY (questionId) REFERENCES chatbotConfig (id) ON DELETE
	SET
		NULL,
		CONSTRAINT FOREIGN KEY (responseTitleId) REFERENCES responseTitle (id) ON DELETE
	SET
		NULL,
		PRIMARY KEY (id)
);

CREATE TABLE userInput (
	id INT AUTO_INCREMENT,
	inputValue VARCHAR (500) NOT NULL,
	responseId INT NOT NULL,
	CONSTRAINT FOREIGN KEY (responseId) REFERENCES response (id) ON DELETE CASCADE,
	PRIMARY KEY (id)
);

ALTER TABLE
	response
ADD
	FULLTEXT INDEX idx_response_content (responseContent);

ALTER TABLE
	chatbotConfig
ADD
	FULLTEXT INDEX idx_question (question);

INSERT INTO
	chatbotConfig (question, typeId)
VALUES
	("Producto", 2),
	("Garantia", 2),
	("Servicios personalizados", 3),
	("Cambios en el producto", 3),
	("Servicio al cliente", 1),
	("Costo del producto", 1),
	("Contactarme con un asesor", 4),
	("Califica tu experiencia", 4);

INSERT INTO
	responseTitle (title, endTitle, useRedirect)
VALUES
	(
		"Escribe brevemente aquí tu petición:",
		"No comprendo tu solicitud.
    Te contactaremos pronto con un asesor.",
		1
	),
	(
		"Escribe brevemente aquí tu queja:",
		"No comprendo tu solicitud.
    Te contactaremos pronto con un asesor.",
		1
	),
	(
		"Escribe brevemente aquí tu sugerencia:",
		"Muchas gracias por su respuesta.",
		0
	),
	(
		"Escribe brevemente aquí tu reclamo:",
		"No comprendo tu solicitud.
    Te contactaremos pronto con un asesor.",
		0
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Cocinas",
		1,
		0,
		null,
		0,
		null,
		1
	),
	(
		"Puertas",
		1,
		0,
		null,
		0,
		null,
		1
	),
	(
		"Material",
		1,
		0,
		null,
		0,
		null,
		2
	),
	(
		"Instalación",
		1,
		0,
		null,
		0,
		null,
		2
	),
	(
		"Producto",
		1,
		0,
		null,
		0,
		null,
		3
	),
	(
		"Diseño",
		1,
		0,
		null,
		0,
		null,
		3
	),
	(
		"Medidas ",
		1,
		0,
		null,
		0,
		null,
		4
	),
	(
		"Material",
		1,
		0,
		null,
		0,
		null,
		4
	),
	(
		"Mala atención",
		1,
		0,
		null,
		0,
		null,
		5
	),
	(
		"Información Incorrecta",
		1,
		0,
		null,
		0,
		null,
		5
	),
	(
		"Publicidad engañosa",
		1,
		0,
		null,
		0,
		null,
		6
	),
	(
		"Fallas en la verificación del pago",
		1,
		0,
		null,
		0,
		null,
		6
	),
	(
		"Sigo teniendo dudas",
		1,
		0,
		null,
		0,
		null,
		7
	),
	(
		"Tengo otra inquietud",
		1,
		0,
		null,
		0,
		null,
		7
	),
	(
		"¿Como estuvo tu experiencia con el asesor?",
		1,
		0,
		null,
		0,
		null,
		8
	),
	(
		"¿Como fue tu experiencia con el producto?",
		1,
		0,
		null,
		0,
		null,
		8
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Colores inadecuados",
		0,
		1,
		1,
		1,
		1,
		null
	),
	(
		"Medidas incorrectas",
		0,
		1,
		1,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Fallas en el material",
		0,
		1,
		2,
		1,
		1,
		null
	),
	(
		"Diseño Inadecuado",
		0,
		1,
		2,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Material Incompleto",
		0,
		1,
		3,
		1,
		4,
		null
	),
	(
		"Material en mal estado",
		0,
		1,
		3,
		1,
		4,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Nunca llego el personal técnico",
		0,
		1,
		4,
		1,
		1,
		null
	),
	(
		"No realizo el soporte",
		0,
		1,
		4,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Solicitar un nuevo producto",
		0,
		1,
		5,
		1,
		1,
		null
	),
	(
		"Realizar una modificación en el producto.",
		0,
		1,
		5,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Quiero cambiar el color",
		0,
		1,
		6,
		1,
		1,
		null
	),
	(
		"Quiero cambiar la forma",
		0,
		1,
		6,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"No era la medida adecuada",
		0,
		1,
		7,
		1,
		1,
		null
	),
	(
		"No se ajusta a el diseño solicitado",
		0,
		1,
		7,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"El material no es suficientemente resistente.",
		0,
		1,
		8,
		1,
		1,
		null
	),
	(
		"El material no es lo que solicite en el pedido",
		0,
		1,
		8,
		1,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"El asesor fue muy grosero.",
		0,
		1,
		9,
		1,
		2,
		null
	),
	(
		"Fue mucho tiempo de espera en línea.",
		0,
		1,
		9,
		1,
		2,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Me siento inconforme con la respuesta brindada por el asesor.",
		0,
		1,
		10,
		1,
		2,
		null
	),
	(
		"La información no fue lo que pregunte.",
		0,
		1,
		10,
		2,
		1,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Me siento inconforme con lo que vi en la compra y lo que me cobraron.",
		0,
		1,
		11,
		1,
		2,
		null
	),
	(
		"La información no es clara en la publicidad del producto.",
		0,
		1,
		11,
		1,
		2,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"La plataforma no me valido la compra aun descontando el dinero.",
		0,
		1,
		12,
		1,
		2,
		null
	),
	(
		"No me genero comprobante de pago.",
		0,
		1,
		12,
		1,
		2,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"El Chatbot no dio solución a mi problema.",
		0,
		1,
		13,
		1,
		3,
		null
	),
	(
		"No me genero solución a la dificultad.",
		0,
		1,
		13,
		1,
		3,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Tengo mas dudas y no encuentro solución en el chat.",
		0,
		1,
		14,
		1,
		3,
		null
	),
	(
		"No me siento cómodo hablando con el chat.",
		0,
		1,
		14,
		1,
		3,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Muy buena, me senti cómodo y soluciono la duda.",
		0,
		1,
		15,
		1,
		3,
		null
	),
	(
		"No me dio respuesta de lo solicitado.",
		0,
		1,
		15,
		1,
		3,
		null
	);

INSERT INTO
	response (
		responseContent,
		isMainTree,
		isTree,
		treeId,
		requiresUserInput,
		responseTitleId,
		questionId
	)
VALUES
	(
		"Excelente, llego en buen estado.",
		0,
		1,
		16,
		1,
		3,
		null
	),
	(
		"Tuvo productos faltantes.",
		0,
		1,
		16,
		1,
		3,
		null
	);