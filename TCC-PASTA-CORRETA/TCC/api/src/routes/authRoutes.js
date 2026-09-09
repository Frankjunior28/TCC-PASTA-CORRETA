import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, registrar } from "../controllers/authController.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensagem: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
});

router.post("/login", loginLimiter, login);
router.post("/registrar", registrar);

export default router;