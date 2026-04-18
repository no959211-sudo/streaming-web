const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// Servir imágenes
app.use("/uploads", express.static("uploads"));

// Configurar subida de archivos
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Base de datos temporal
let pedidos = [];

// Crear pedido
app.post("/compra", upload.single("comprobante"), (req, res) => {
  const { nombre, email, plan } = req.body;

  const nuevoPedido = {
    id: Date.now(),
    nombre,
    email,
    plan,
    comprobante: req.file.filename,
    estado: "pendiente",
    fechaInicio: null,
    fechaFin: null
  };

  pedidos.push(nuevoPedido);

  res.send("OK");
});

// Ver pedidos
app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});

// Confirmar pago
app.post("/confirmar/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) return res.send("No encontrado");

  pedido.estado = "activo";
  pedido.fechaInicio = new Date();

  let dias = pedido.plan === "Premium" ? 30 : 15;
  let fin = new Date();
  fin.setDate(fin.getDate() + dias);

  pedido.fechaFin = fin;

  res.send("Pago confirmado");
});

// Detectar vencidos automáticamente
setInterval(() => {
  const hoy = new Date();

  pedidos.forEach(p => {
    if (p.estado === "activo" && new Date(p.fechaFin) < hoy) {
      p.estado = "vencido";
    }
  });
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo"));