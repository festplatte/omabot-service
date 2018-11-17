const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fs = require("fs");
const config = require("./config");

var options = config.isProd
  ? {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/www.realisable.de/privkey.pem"
      ),
      cert: fs.readFileSync("/etc/letsencrypt/live/www.realisable.de/cert.pem"),
      ca: fs.readFileSync("/etc/letsencrypt/live/www.realisable.de/chain.pem")
    }
  : null;

const lotharPhrases = [
  "Wäre, wäre, Fahrradkette",
  "Ein Wort gab das andere - wir hatten uns nichts zu sagen.",
  "Wir sind eine gut intrigierte Truppe.",
  "Schiedsrichter kommt für mich nicht in Frage, schon eher etwas, das mit Fußball zu tun hat.",
  "'Sis' are different exercises. Not only bumm!",
  "Die Schuhe müssen immer zum Gürtel passen!",
  "Wichtig ist, dass er jetzt eine klare Linie in sein Leben bringt."
];

const app = express();
app.use(bodyParser.json());

const server = https
  .createServer(options, app)
  .listen(config.port, () => console.log(`Listening on port ${config.port}!`));

function getLotharPhrase(req, res) {
  console.log("Called /lothar");
  console.log(req);
  console.log(req.method);
  console.log(req.body);
  let phrase =
    lotharPhrases[Math.floor(Math.random() * lotharPhrases.length - 1)];
  res.json({
    replies: [
      {
        type: "text",
        content: phrase
      }
    ]
  });
}

app.get("/lothar", getLotharPhrase);
app.post("/lothar", getLotharPhrase);
