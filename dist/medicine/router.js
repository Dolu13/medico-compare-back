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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const currentDirectory = path_1.default.resolve();
router.get("/autorisations/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.autorisationType.findMany({
            select: {
                Autorisation_Id: true,
                Name: true,
            },
        });
        res.status(200).json({
            result: users,
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
        const users = yield prisma.specificMedicine.findMany({
            select: {
                CISCode: true,
                Name: true,
                Autorisation: true,
            },
        });
        res.status(200).json({
            result: users,
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
function loadAutorisationTypeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const autorisationTypes = yield prisma.autorisationType.findMany({
            where: {
                Autorisation_Id: { in: [1, 2, 3] }
            }
        });
        if (autorisationTypes.length > 2) {
            return;
        }
        const autorisationTypePath = path_1.default.join(currentDirectory, 'src', 'medicine', 'autorisationTypes.json');
        const data = yield fs_extra_1.default.readFile(autorisationTypePath, 'utf8');
        const newAutorisationType = JSON.parse(data);
        for (const autorisation of newAutorisationType) {
            yield prisma.autorisationType.create({
                data: {
                    Autorisation_Id: autorisation.Id,
                    Name: autorisation.Name,
                }
            });
        }
    });
}
function loadSpecificMedicineData() {
    return __awaiter(this, void 0, void 0, function* () {
        const specificMedicine = yield prisma.specificMedicine.findFirst();
        if (specificMedicine) {
            return;
        }
        const specificMedicinePath = path_1.default.join(currentDirectory, 'src', 'medicine', 'specificMedicine.json');
        const data = yield fs_extra_1.default.readFile(specificMedicinePath, 'utf8');
        const newSpecificMedicine = JSON.parse(data);
        for (const medicine of newSpecificMedicine) {
            try {
                yield prisma.specificMedicine.create({
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
            }
            catch (error) {
                console.error('Erreur lors de l\'insertion du médicament:', medicine, error);
            }
        }
    });
}
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield loadAutorisationTypeData();
            yield loadSpecificMedicineData();
        }
        catch (error) {
            console.error('Erreur lors du chargement des données', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
loadData();
exports.default = router;
