import { Router } from "express";
import {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarStatusPedido,
  deletarPedido,
} from "../controllers/pedidoController.js";

const router = Router();

router.get("/", listarPedidos);
router.get("/:id", buscarPedidoPorId);
router.post("/", criarPedido);
router.put("/:id", atualizarStatusPedido);
router.delete("/:id", deletarPedido);

export default router;