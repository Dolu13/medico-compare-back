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
// Route pour créer un nouvel utilisateur
router.get("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (name) {
        try {
            const newUser = yield prisma.user.create({
                data: {
                    name: name,
                },
                select: {
                    Id: true,
                    Name: true,
                },
            });
            res.json(newUser);
        }
        catch (error) {
            console.error('Erreur lors de l\'exécution de la requête', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
        finally {
            yield prisma.$disconnect();
        }
    }
    else {
        res.status(400).json({ error: 'Le nom est manquant' });
    }
}));
// Route pour obtenir tous les utilisateurs
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                Id: true,
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
exports.default = router;
