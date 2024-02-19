const { default: mongoose } = require("mongoose");
const dev = require("./config");

const db_connection = async () => {
  try {
    await mongoose.connect(dev.db.url);
    console.log(`Connection....`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = db_connection;
