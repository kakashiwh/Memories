import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import postRouters from './routes/posts.js';
import {fileURLToPath} from 'url';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(bodyParser.json({limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts',postRouters);
const PORT = process.env.PORT || 5000;
//const CONNECTION_URL='mongodb+srv://rishabhsoni:rishabhsoni@cluster0.lwq6dqg.mongodb.net/?retryWrites=true&w=majority';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

mongoose.set("strictQuery", false);

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})

/*
mongoose.connect(process.env.CONNECTION_URL,{ useNewUrlParser : true , useUnifiedTopology: true})
     .then(() => app.listen(PORT,() => console.log(`Server running on port: ${PORT}`)))
     .catch((error) => console.log(error));
 */
     app.use(express.static(path.join(__dirname, "./client/build")));
     app.get("*", function (_, res) {
       res.sendFile(
         path.join(__dirname, "./client/build/index.html"),
         function (error) {
           res.status(500).send(error.message);
         }
       );
     });
