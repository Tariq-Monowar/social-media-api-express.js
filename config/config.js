require("dotenv").config();

const dev = {
  db: {
    url: process.env.DBURL,
  },
  app: {
    port: process.env.PORT,
  },
};

module.exports = dev;
