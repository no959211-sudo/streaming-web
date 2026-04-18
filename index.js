const express = require("express");

const cors = require("cors");
const path = require("path");
upload.single("comprobante")
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
upload.single("comprobante")
// Servir frontend
app.use(express.static(path.join(__dirname)));
upload.single("comprobante")
// Servir uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Config multer

  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
upload.single("comprobante")

// Base simple
let pedidos = [];

// Rutas
app.post("/compra", (req, res) => {
  const { nombre, email, plan } = req.body;

  const nuevo = {
    id: Date.now(),
    nombre,
    email,
    plan,
    comprobante: req.file ? req.file.filename : null,
    estado: "pendiente",
    fechaInicio: null,
    fechaFin: null
  };

  pedidos.push(nuevo);
  res.send("OK");
});

app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});

app.post("/confirmar/:id", (req, res) => {
  const pedido = pedidos.find(p => p.id == req.params.id);
  if (!pedido) return res.send("No encontrado");

  pedido.estado = "activo";
  pedido.fechaInicio = new Date();

  let dias = pedido.plan === "Premium" ? 30 : 15;
  let fin = new Date();
  fin.setDate(fin.getDate() + dias);
  pedido.fechaFin = fin;

  res.send("Confirmado");
});

// Puerto correcto para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto", PORT);
});
