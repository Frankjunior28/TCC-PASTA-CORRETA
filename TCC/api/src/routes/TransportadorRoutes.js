import { Router } from "express";
import {
  listarTransportadores,
  criarTransportador,
  obterTransportador,
  atualizarTransportador,
  deletarTransportador,
} from "../controllers/transportadorController.js";

const router = Router();

router.get("/", listarTransportadores);
router.post("/", criarTransportador);
router.get("/:id", obterTransportador);
router.put("/:id", atualizarTransportador);
router.delete("/:id", deletarTransportador);

export default router;