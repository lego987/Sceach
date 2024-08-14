const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@viaduct.proxy.rlwy.net:22583/railway",
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected:", res.rows);
  }
  pool.end();
});
