import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs-extra';

const prisma = new PrismaClient();
const router: Router = express.Router();
const currentDirectory = path.resolve();

router.get("/autorisations/all", async (req: Request, res: Response) => {
    try {
        const users = await prisma.autorisationType.findMany({
            select: {
                Autorisation_Id: true,
                Name: true,
            },
        });
        res.status(200).json({
            result: users,
          });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
})

router.get("/all", async (req: Request, res: Response) => {
    try {
        const users = await prisma.specificMedicine.findMany({
            select: {
                CISCode: true,
                Name: true,
                Autorisation: true,
            },
        });
        res.status(200).json({
            result: users,
          });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
});


async function loadAutorisationTypeData() {
    const autorisationTypes = await prisma.autorisationType.findMany({
        where: {
            Autorisation_Id: { in: [1, 2, 3] }
        }
    });

    if (autorisationTypes.length > 2) {
        return;
    }

    const autorisationTypePath = path.join(currentDirectory, 'src', 'medicine', 'autorisationTypes.json');
    const data = await fs.readFile(autorisationTypePath, 'utf8');
    const newAutorisationType:{
      "Id": number,
      "Name": string,
    }[] = JSON.parse(data);
  
    for (const autorisation of newAutorisationType) {
      await prisma.autorisationType.create({
        data: {
            Autorisation_Id: autorisation.Id,
            Name: autorisation.Name,
        }
      });
    }
}

async function loadSpecificMedicineData() {
    const specificMedicine = await prisma.specificMedicine.findFirst();
    if (specificMedicine) {
        return;
    }
    const specificMedicinePath = path.join(currentDirectory, 'src', 'medicine', 'specificMedicine.json');
    const data = await fs.readFile(specificMedicinePath, 'utf8');
    const newSpecificMedicine:{
      "CIS Code": number,
      "Name": string,
      "Form": string,
      "Administration": string,
      "Autorisation": number,
      "Commercialized": boolean,
      "AMM Date": string,
      "EU Number": string,
      "Company": string,
      "Reinforced surveillance": boolean,
    }[] = JSON.parse(data);
  
    for (const medicine of newSpecificMedicine) {
        try {
            await prisma.specificMedicine.create({
                data: {
                    CISCode: medicine["CIS Code"],
                    Name: medicine.Name,
                    Form: medicine.Form,
                    Administration: medicine.Administration,
                    AutorisationId: medicine.Autorisation,
                    Commercialized: medicine.Commercialized,
                    AMMDate: medicine["AMM Date"],
                    EUNumber: medicine["EU Number"],
                    Company: medicine.Company,
                    ReinforcedSurveillance: medicine["Reinforced surveillance"],
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'insertion du médicament:', medicine, error);
        }
    }
  }

  async function loadData() {
    try {
        await loadAutorisationTypeData();
        await loadSpecificMedicineData(); 
    } catch (error) {
        console.error('Erreur lors du chargement des données', error);
    } finally {
        await prisma.$disconnect();
    }
}

loadData();

export default router;
