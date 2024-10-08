import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import specificMedicineRouter from './medicine/router'
import { loadData } from "./medicine/initialize";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.use(express.json()); 
app.use('/specificMedicine', specificMedicineRouter);


app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});

loadData();


app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 


