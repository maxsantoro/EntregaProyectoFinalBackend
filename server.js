const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.set('view engine', 'ejs')
app.set('views', './views')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const Container = require("./container/container.js");
const products = new Container("./container/products.json");
const messages = new Container("./container/message.json");

const PORT = process.env.PORT || 8080;

function mdl(req, res, next) {
  if (req.query.rol !== "admin") {
    res.status(500).send("No se encuentra autorizado");
  }
  next();
}

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  messages.getAll().then((messages) => {
    socket.emit("messages", messages);
  });
  socket.on("message", (messagesData) => {
    messages.save(messagesData),
      messages.getAll().then((messages) => {
        io.sockets.emit("messages", messages);
      });
  });
});

app.get("/productos", (req, res) => {
  products.getAll().then((products) => {
    res.render("main", { products });
  });
});
app.get("productos/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  products.getById(id).then((prod) => {
    res.json(prod);
  });
});

app.post("products", mdl, (req, res) => {
  let { name, price, thumbnail } = req.body;
  let id;
  products.getAll().then((products) => {
    if (products.length == 0) {
      id = 1;
    } else {
      id = products.length + 1;
    }
  });
  let article = { name: name, price: price, thumbnail: thumbnail };
  const newProduct = { ...article, id };
  products.save(newProduct);
  res.redirect("/productos");
});
app.put("productos/:id", mdl, (req, res) => {
  let { name, price, thumbnail } = req.body;
  let { id } = req.params;
  id = parseInt(id);
  let producto = { name: name, price: price, thumbnail: thumbnail };

  products.getAll().then((modifiedProduct) => {
    let obj = modifiedProduct.find((obj) => obj.id === parseInt(id));
    let index = modifiedProduct.indexOf(obj);
    let productModified = { ...producto, id };
    if (!obj) {
      res.json({ msj: " No se encontro el producto" });
    } else {
      products.remplace(productModified, index);
      res.json({ msj: "Producto modificado con exito" });
    }
  });
});

app.delete("/productos", mdl, (req, res) => {
  products.deteleAll();
});

app.delete('/productos/":id', mdl, (req, res) => {
  let { id } = req.params;
  products.deleteById(id);
});

const server = httpServer.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

server.on("error", (error) => console.log("error creando el servidor"));
