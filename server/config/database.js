const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(typeof process.env.DB_URI, "mongo");
    await mongoose
      .connect(process.env.DB_URI)
      .then((data) => {
        console.log(`Database connect successfully: ${data.connection.host}`);
      })
      .catch((err) => {
        console.log(`throw error : ${err}`);
      });
  } catch (error) {
    console.log(`Some went Wrong Error:${error}`);
  }
};
module.exports = connectDB;
