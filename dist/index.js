"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./medicine/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = express_1.default.Router();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use('/specificMedicine', router_1.default);
app.use(router);
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
