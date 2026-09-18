import { Router } from "express";
import {
  listarAdministradores,
  criarAdministrador,
  obterAdministrador,
  atualizarAdministrador,
  deletarAdministrador,
} from "../controllers/AdministradorController.js";

const router = Router();

router.get("/", listarAdministradores);
router.post("/", criarAdministrador);
router.get("/:id", obterAdministrador);
router.put("/:id", atualizarAdministrador);
router.delete("/:id", deletarAdministrador);

export default router;