const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV ECommerce start with: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));
  // se gui notify o day neu server crash
});
