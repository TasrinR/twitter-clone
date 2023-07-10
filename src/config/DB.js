const mongoose = require("mongoose");

module.exports = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mongoose.set("strictQuery", true);
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      return conn;
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
