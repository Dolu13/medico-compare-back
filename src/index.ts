import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import specificMedicineRouter from './medicine/router'

dotenv.config();
const app = express();
const router: Router = express.Router();

const PORT = process.env.PORT;
app.use(express.json()); 
app.use('/specificMedicine', specificMedicineRouter);
app.use(router);


app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});


app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 


