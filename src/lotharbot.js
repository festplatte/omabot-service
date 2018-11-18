const watson = require("./watson-service");

function lotharbot(req, res) {
  console.log("Called /story");
  let body = JSON.parse(req.body);
  console.log(body);
}

module.exports = lotharbot;
