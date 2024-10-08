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
exports.loadData = loadData;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const prisma = new client_1.PrismaClient();
const currentDirectory = path_1.default.resolve();
function loadAutorisationTypeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const autorisationTypes = yield prisma.autorisationType.findMany({
            where: {
                autorisation_Id: { in: [1, 2, 3, 4, 5] }
            }
        });
        if (autorisationTypes.length > 4) {
            console.log('pas d\'autorisation ajouté');
            return;
        }
        const autorisationTypePath = path_1.default.join(currentDirectory, 'src', 'medicine', 'autorisationTypes.json');
        const data = yield fs_extra_1.default.readFile(autorisationTypePath, 'utf8');
        const newAutorisationType = JSON.parse(data);
        for (const autorisation of newAutorisationType) {
            yield prisma.autorisationType.create({
                data: {
                    autorisation_Id: autorisation.Id,
                    name: autorisation.Name,
                }
            });
        }
        console.log('fin de l\'ajout d\'autorisation');
    });
}
function loadAvisSMRData() {
    return __awaiter(this, void 0, void 0, function* () {
        const avisSmr = yield prisma.avisSmr.findFirst();
        if (avisSmr) {
            console.log('pas d\'avis SMR ajouté');
            return;
        }
        const avisSmrPath = path_1.default.join(currentDirectory, 'src', 'medicine', 'avis_smr.json');
        const data = yield fs_extra_1.default.readFile(avisSmrPath, 'utf8');
        const sanitizedData = data.replace(/^\uFEFF/, '');
        const newAvisSmr = JSON.parse(sanitizedData);
        for (const avis of newAvisSmr) {
            const specificMedicineExists = yield prisma.specificMedicine.findUnique({
                where: { CIS_code: avis.CIS_code },
            });
            const avisSmrExists = yield prisma.avisSmr.findUnique({
                where: { CIS_code: avis.CIS_code },
            });
            if (specificMedicineExists && !avisSmrExists) {
                yield prisma.avisSmr.create({
                    data: {
                        CIS_code: avis.CIS_code,
                        avis_smr: avis.avis_smr,
                    }
                });
            }
        }
        console.log('fin de l\'ajout d\'avis smr');
    });
}
function loadAvisASMRData() {
    return __awaiter(this, void 0, void 0, function* () {
        const avisAsmr = yield prisma.avisAsmr.findFirst();
        if (avisAsmr) {
            console.log('pas d\'avis ASMR ajouté');
            return;
        }
        const avisAsmrPath = path_1.default.join(currentDirectory, 'src', 'medicine', 'avis_asmr.json');
        const data = yield fs_extra_1.default.readFile(avisAsmrPath, 'utf8');
        const sanitizedData = data.replace(/^\uFEFF/, '');
        const newAvisAsmr = JSON.parse(sanitizedData);
        for (const avis of newAvisAsmr) {
            const specificMedicineExists = yield prisma.specificMedicine.findUnique({
                where: { CIS_code: avis.CIS_code },
            });
            const avisAsmrExists = yield prisma.avisAsmr.findUnique({
                where: { CIS_code: avis.CIS_code },
            });
            if (specificMedicineExists && !avisAsmrExists)
                yield prisma.avisAsmr.create({
                    data: {
                        CIS_code: avis.CIS_code,
                        avis_asmr: avis.avis_asmr,
                    }
                });
        }
        console.log('fin de l\'ajout d\'asmr');
    });
}
function loadSpecificMedicineData() {
    return __awaiter(this, void 0, void 0, function* () {
        const specificMedicine = yield prisma.specificMedicine.findFirst();
        if (specificMedicine) {
            console.log('pas de médicaments ajouté ajouté');
            return;
        }
        const specificMedicinePath = path_1.default.join(currentDirectory, 'src', 'medicine', 'specificMedicine.json');
        const data = yield fs_extra_1.default.readFile(specificMedicinePath, 'utf8');
        const newSpecificMedicine = JSON.parse(data);
        for (const medicine of newSpecificMedicine) {
            try {
                yield prisma.specificMedicine.create({
                    data: {
                        CIS_code: medicine["CIS_code"],
                        name: medicine.name,
                        form: medicine.form,
                        administration: medicine.administration,
                        autorisationId: medicine.autorisation,
                        commercialized: medicine.commercialized,
                        AMM_date: medicine["AMM_date"],
                        EU_number: medicine["EU_number"],
                        company: medicine.company,
                        reinforced_surveillance: medicine["reinforced_surveillance"],
                    }
                });
            }
            catch (error) {
                console.error('Erreur lors de l\'insertion du médicament:', medicine, error);
            }
        }
        console.log('fin de l\'ajout de médicaments');
    });
}
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield loadAutorisationTypeData();
            yield loadSpecificMedicineData();
            yield loadAvisSMRData();
            yield loadAvisASMRData();
            // vider les tables
            //await prisma.avisSmr.deleteMany();
            //await prisma.avisAsmr.deleteMany();
            //await prisma.specificMedicine.deleteMany();
            //await prisma.autorisationType.deleteMany();
            //console.log('fin de la deletion');
        }
        catch (error) {
            console.error('Erreur lors du chargement des données', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
