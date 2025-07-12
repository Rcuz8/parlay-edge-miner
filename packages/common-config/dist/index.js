"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trace = exports.logger = exports.getConfig = exports.envSchema = void 0;
const zod_1 = require("zod");
const pino_1 = __importDefault(require("pino"));
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    OPENAI_API_KEY: zod_1.z.string(),
    ODDS_API_KEY: zod_1.z.string(),
    TWILIO_SID: zod_1.z.string(),
    TWILIO_TOKEN: zod_1.z.string(),
    TWILIO_FROM: zod_1.z.string(),
    TWILIO_TO: zod_1.z.string(),
    LANGCHAIN_TRACING: zod_1.z.string().optional(),
});
const getConfig = () => exports.envSchema.parse(process.env);
exports.getConfig = getConfig;
exports.logger = (0, pino_1.default)({
    name: 'parlay-edge-miner',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
/**
 * Minimal LangSmith tracing helper to avoid heavy deps.
 */
const trace = (name, details) => {
    if (process.env.LANGCHAIN_TRACING === 'true') {
        exports.logger.debug({ trace: name, details });
    }
};
exports.trace = trace;
