const app = require("./app");
const dev = require("./config/config");
const db_connection = require("./config/db");

const port = dev.app.port;
app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
  await db_connection();
});
