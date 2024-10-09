import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router: Router = express.Router();

/**
 * components:
 *   schemas:
 *     SpecificMedicine:
 *       type: object
 *       properties:
 *         CIS_code:
 *           type: integer
 *           description: "The CIS code of the medicine"
 *         name:
 *           type: string
 *           description: "Name of the medicine"
 *         administration:
 *           type: string
 *           description: "Method of administration of the medicine"
 *         commercialized:
 *           type: boolean
 *           description: "Is the medicine commercialized?"
 *         AMM_date:
 *           type: string
 *           description: "Authorization date of the medicine"
 *         company:
 *           type: string
 *           description: "Company producing the medicine"
 *         reinforced_surveillance:
 *           type: boolean
 *           description: "Is the medicine under reinforced surveillance?"
 *         autorisation:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: "Authorization type"
 *         avisSmr:
 *           type: object
 *           properties:
 *             avis_smr:
 *               type: string
 *               description: "SMR (Medical Service Rendered) opinion"
 *         avisAsmr:
 *           type: object
 *           properties:
 *             avis_asmr:
 *               type: string
 *               description: "ASMR (Improvement of Medical Service Rendered) opinion"
 */
         
/**
 * @swagger
 * /specificMedicine/autocomplete/{text}:
 *   get:
 *     summary: Retrieve a list of specific medicine that match by name with text
 *     tags: [SpecificMedicine]
 *     parameters:
 *       - in: path
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *         description: The text present in name specifics medicine
 *     responses:
 *       200:
 *         description: List of specific medicine correspondant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpecificMedicine'
 */
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

/**
 * @swagger
 * /specificMedicine/medicine/{id}:
 *   get:
 *     summary: Retrieve a specific medicine by its ID
 *     tags: [SpecificMedicine]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the specific medicine
 *     responses:
 *       200:
 *         description: The specific medicine
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpecificMedicine'
 */
router.get("/medicine/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid CIS_code, must be a number." });
        return;
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
                genericMedicine: {
                    select: {
                        name: true,
                    }
                }
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

/**
 * @swagger
 * /specificMedicine/all:
 *   get:
 *     summary: Retrieve all specific medicine
 *     tags: [SpecificMedicine]
 *     responses:
 *       200:
 *         description: The list of specific medicine pagine 20
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SpecificMedicine'
 */
router.get("/all", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; 
        const limit = parseInt(req.query.limit as string) || 20; 
        const skip = (page - 1) * limit;
        const medicine = await prisma.specificMedicine.findMany({
            skip: skip, 
            take: limit, 
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
                genericMedicine: {
                    select: {
                        name: true,
                    }
                }
            },
        });

        res.status(200).json({
            result: medicine,
            page: page,
            limit: limit,
          });
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } finally {
        await prisma.$disconnect();
    }
});


export default router;
