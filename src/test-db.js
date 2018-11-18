const connection = require("./dbconnection");

connection
  .query(
    "INSERT INTO statements (speech, sentiment_score, sentiment_label) VALUES (?, ?, ?)",
    ["Hallo Welt", 0.3, "positive"]
  )
  .then(res => console.log(res));
