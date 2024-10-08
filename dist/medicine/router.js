"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/autocomplete/:text", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.params.text;
    try {
        const medicines = yield prisma.specificMedicine.findMany({
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
    }
    catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
router.get("/medicine/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid CIS_code, must be a number." });
    }
    try {
        const medicine = yield prisma.specificMedicine.findUnique({
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
    }
    catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicine = yield prisma.specificMedicine.findMany({
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
    }
    catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.default = router;
