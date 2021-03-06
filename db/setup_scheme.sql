CREATE TABLE statements (
    id INT(10) AUTO_INCREMENT,
    speech VARCHAR(5000) NOT NULL,
    sentiment_score FLOAT(4,4),
    sentiment_label VARCHAR(10),
    PRIMARY KEY (id)
);

CREATE TABLE entities (
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE statements_entities(
    statement_id INT(10),
    entity VARCHAR(100),
    relevance FLOAT(4,4),
    usecount INT(10),
    PRIMARY KEY (statement_id, entity),
    FOREIGN KEY (statement_id) REFERENCES statements(id),
    FOREIGN KEY (entity) REFERENCES entities(name)
);


-- CHARACTER SET 'utf8mb4' 
-- COLLATE 'utf8mb4_general_ci';
