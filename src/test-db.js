const connection = require("./dbconnection");

connection
  .query("INSERT INTO entities (name) VALUES ('mariadb')")
  .then(res => console.log(res));

// connection
//   .then(conn => {
//     conn
//       .query("INSERT INTO entites SET mariadb")
//       //   .query("SELECT * FROM entities")
//       .then(rows => {
//         console.log(rows); //[ {val: 1}, meta: ... ]
//       })
//       .catch(err => {
//         //handle error
//         conn.end();
//       });
//   })
//   .catch(err => {
//     //not connected
//   });
