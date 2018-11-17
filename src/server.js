const express = require("express");
const https = require("https");
const fs = require("fs");
const port = 3000;

var options = {
  key: fs.readFileSync("/etc/letsencrypt/live/www.realisable.de/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/www.realisable.de/cert.pem")
};

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

const server = https
  .createServer(options, app)
  .listen(port, () => console.log(`Listening on port ${port}!`));

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/lothar", (req, res) => {
  res.send(lotharPhrases[Math.floor(Math.random() * lotharPhrases.length - 1)]);
});
