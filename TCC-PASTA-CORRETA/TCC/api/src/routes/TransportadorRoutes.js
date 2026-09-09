import { Router } from "express";
import { autenticar, autorizar } from "../middleware/authMiddleware.js";
import {
  listarTransportadores,
  criarTransportador,
  obterTransportador,
  atualizarTransportador,
  deletarTransportador,
} from "../controllers/TransportadorController.js";

const router = Router();

router.use(autenticar);
router.use(autorizar("gerente"));

router.get("/", listarTransportadores);
router.post("/", criarTransportador);
router.get("/:id", obterTransportador);
router.put("/:id", atualizarTransportador);
router.delete("/:id", deletarTransportador);

export default router;