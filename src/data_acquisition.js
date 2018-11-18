require('dotenv').config();

var fs = require('fs');
var csv = require("fast-csv");
const fetch = require("node-fetch");
const connection = require("./dbconnection");

csv
    .fromPath("data/matthaeus_zeit_2018.csv", {delimiter: ";"})
    .on("data", function(data) {
        nlp(data[1]);
    })
    .on("end", function(data) {
        console.log(data);
    });

function nlp(statement) {
    fetch("https://gateway-fra.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-19", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + Buffer.from("apikey:" + process.env.NATURAL_LANGUAGE_UNDERSTANDING_API_KEY).toString("base64"),
            "X-Watson-Learning-Opt-Out": "true"
        },
        body: JSON.stringify({
            "text": "I still have a dream. It is a dream deeply rooted in the American dream. I have a dream that one day this nation will rise up and live out the true meaning of its creed: \"We hold these truths to be self-evident, that all men are created equal.\"",
            "features": {
                "entities": {},
                "sentiment": {},
                "keywords": {},
                "categories": {}
            }
        })
    })
    .then(res => res.json())
    .then(res => {
        // Store statement
        connection.query("INSERT INTO statements (speech, sentiment_score, sentiment_label) VALUES (?, ?, ?);", [statement, res.sentiment.document.score, res.sentiment.document.label]);

        res.entities.forEach(x => {
            // Store entity
            connection.query("BEGIN IF NOT EXISTS (SELECT * FROM entities WHERE name = ?) BEGIN INSERT INTO entities (name) VALUES (?); END END", [x.text, x.text]);

            // Store relation
            connection.query("INSERT INTO statement_entities VALUES (?, ?, ?, ?);", [statementId, x.text, x.relevance, x.score]);
        });
    });        
}