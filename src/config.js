const devConfig = {
  isProd: false,
  port: 3000,
  dbConfig: {
    host: "localhost",
    database: "omabot",
    user: "root",
    password: ""
  }
};
const prodConfig = {
  isProd: true,
  port: 3000,
  dbConfig: {
    host: "localhost",
    user: "root",
    database: "omabot",
    password: "Test123."
  }
};

module.exports = process.env.NODE_ENV == "prod" ? prodConfig : devConfig;
