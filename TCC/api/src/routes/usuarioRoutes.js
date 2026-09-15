import { Router } from "express";
import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  loginUsuario,
  atualizarUsuario,
  deletarUsuario
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;