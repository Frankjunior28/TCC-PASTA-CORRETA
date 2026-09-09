import { Router } from "express";
import { autenticar } from "../middleware/authMiddleware.js";
import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuarioController.js";

const router = Router();

router.use(autenticar);

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;