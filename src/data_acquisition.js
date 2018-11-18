require("dotenv").config();

var fs = require("fs");
var csv = require("fast-csv");
const fetch = require("node-fetch");
const connection = require("./dbconnection");

csv
  .fromPath("data/matthaeus_zeit_2018.csv", { delimiter: ";" })
  .on("data", function(data) {
    nlp(data[1]);
  })
  .on("end", function(data) {
    console.log(data);
  });

function nlp(statement) {
  fetch(
    "https://gateway-fra.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-19",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            "apikey:" + process.env.NATURAL_LANGUAGE_UNDERSTANDING_API_KEY
          ).toString("base64"),
        "X-Watson-Learning-Opt-Out": "true"
      },
      body: JSON.stringify({
        text: statement,
        features: {
          entities: {},
          sentiment: {},
          keywords: {},
          categories: {}
        }
      })
    }
  )
    .then(res => res.json())
    .then(res => {
      let entityMap = new Map();
      res.entities.forEach(entity => {
        if (entityMap.has(entity.text.toLowerCase())) {
          let prevEntity = entityMap.get(entity.text.toLowerCase());
          prevEntity.count += entity.count;
          prevEntity.score = Math.max(prevEntity.score, entity.score);
        } else {
          entityMap.set(entity.text.toLowerCase(), {
            count: entity.count,
            relevance: entity.relevance
          });
        }
      });
      // Store statement
      connection
        .query(
          "INSERT INTO statements (speech, sentiment_score, sentiment_label) VALUES (?, ?, ?);",
          [
            statement,
            res.sentiment.document.score,
            res.sentiment.document.label.toLowerCase()
          ]
        )
        .then(statementResult => {
          entityMap.forEach((value, key) => {
            // Store entity
            connection
              .query(
                "INSERT INTO entities (name) SELECT ? FROM DUAL WHERE NOT EXISTS (SELECT name FROM entities WHERE name = ?);",
                [key, key]
              )
              .then(entityResult => {
                // Store relation
                connection.query(
                  "INSERT INTO statements_entities VALUES (?, ?, ?, ?);",
                  [statementResult.insertId, key, value.relevance, value.count]
                );
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
    });
}
