import express, { Request, Response } from "express";
import dotenv from "dotenv";
import specificMedicineRouter from './medicine/router'
import { loadData } from "./medicine/initialize";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
dotenv.config();
const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:80'] // Whitelist the domains you want to allow
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MedicoCompare API",
      version: "1.0.0",
      description: "API for managing medicine",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
      {
        url: "https://medico-compare-back.vercel.app/",
      },
    ],
    components: {
      schemas: {
        SpecificMedicine: {
          type: "object",
          properties: {
            CIS_code: { type: "integer", description: "The CIS code of the medicine" },
            name: { type: "string", description: "Name of the medicine" },
            administration: { type: "string", description: "Method of administration" },
            commercialized: { type: "boolean", description: "Is the medicine commercialized?" },
            AMM_date: { type: "string", description: "Authorization date of the medicine" },
            company: { type: "string", description: "Company producing the medicine" },
            reinforced_surveillance: { type: "boolean", description: "Is the medicine under reinforced surveillance?" },
            autorisation: { 
              type: "object", 
              properties: { name: { type: "string", description: "Authorization type" } } 
            },
            avisSmr: {
              type: "object", 
              properties: { avis_smr: { type: "string", description: "SMR opinion" } } 
            },
            avisAsmr: {
              type: "object", 
              properties: { avis_asmr: { type: "string", description: "ASMR opinion" } } 
            },
            genericMedicine: {
              type: "object", 
              properties: { name: { type: "string", description: "generic medecine associate" } } 
            }
          }
        },
        SpecificMedicineAutocomplete: {
          type: "object",
          properties: {
            CIS_code: { type: "integer", description: "The CIS code of the medicine" },
            name: { type: "string", description: "Name of the medicine" },
          }
        }
      }
    }
  },
  apis: [
    `${__dirname}/medicine/router.js`,
  ],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const PORT = process.env.PORT;
app.use(express.json()); 
app.use(cors(corsOptions));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }));
app.use('/specificMedicine', specificMedicineRouter);


app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});

loadData();



