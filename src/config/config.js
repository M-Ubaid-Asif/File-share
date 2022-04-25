import dotenv from "dotenv";

dotenv.config();

const db = {
  uri: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
const config = {
  db,
  port: process.env.PORT,
};

export default config;
