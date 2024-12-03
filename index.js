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
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        timeout: 0,
        ignoreDefaultArgs: false,
        args: [
            "--kiosk",
            "--app",
            "--disable-infobars ",
            "--silent",
            "--disable-gpu",
            "--disable-extensions",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--start-fullscreen",
        ],
        defaultViewport: null,
        protocolTimeout: 120000,
    });
    const page = yield browser.newPage();
    yield page.goto(`file://${path_1.default.join(__dirname, "index.html")}`);
}))();
