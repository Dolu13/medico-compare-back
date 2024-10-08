import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import path from 'path';

const prisma = new PrismaClient();
const router: Router = express.Router();

router.get("/autocomplete/:text", async (req: Request, res: Response) => {
    const text = req.params.text;

    try {
        const medicines = await prisma.specificMedicine.findMany({
            where: {
                name: {
                    contains: text,
                },
            },
            select: {
                CIS_code: true,
                name: true,
            },
        });

        res.status(200).json({
            result: medicines,
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
});

router.get("/medicine/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid CIS_code, must be a number." });
    }
    try {
        const medicine = await prisma.specificMedicine.findUnique({
            where: {
                CIS_code: id,
            },
            select: {
                CIS_code: true,
                name: true,
                administration: true,
                commercialized: true,
                AMM_date: true,
                company: true,
                reinforced_surveillance: true,
                autorisation: {
                    select: {
                        name: true,
                    }
                },
                avisSmr: { 
                    select: {
                        avis_smr: true,
                    }
                },
                avisAsmr: { 
                    select: {
                        avis_asmr: true,
                    }
                },
            },
        });

        res.status(200).json({
            result: medicine,
          });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
});


router.get("/all", async (req: Request, res: Response) => {
    try {
        const medicine = await prisma.specificMedicine.findMany({
            select: {
                CIS_code: true,
                name: true,
                administration: true,
                commercialized: true,
                AMM_date: true,
                company: true,
                reinforced_surveillance: true,
                autorisation: {
                    select: {
                        name: true,
                    }
                },
                avisSmr: { 
                    select: {
                        avis_smr: true,
                    }
                },
                avisAsmr: { 
                    select: {
                        avis_asmr: true,
                    }
                },
            },
        });

        res.status(200).json({
            result: medicine,
          });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
});


export default router;
