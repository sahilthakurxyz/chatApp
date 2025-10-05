const { app, server } = require("./app.js");

const { v2: cloudinary } = require("cloudinary");

const connectDB = require("./config/database.js");
require("dotenv").config({ path: "config/.env" });
const port = process.env.PORT || 4000;

process.on("uncaughtException", (err) => {
  console.log(`Server is Shutting Down due to Unchaught Error,${err.message}`);

  process.exit(1);
});
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
// unhandled Promise Rejecton
process.on("unhandledRejection", (err) => {
  console.log(
    `Server is Shutting down due to server Unhandled Promise Rejecton,${err.message}`
  );
  server.close(() => {
    process.exit(1);
  });
});
