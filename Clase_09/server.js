// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
    res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para ubicar un producto FUNCIONA

app.get("/:id", (req,res)=>{
    const idFruta = parseInt(req.params.id);
    const frutas = leerFrutas();

    const index = frutas.findIndex((fruta) => fruta.id === idFruta);

    if (index !== -1) {
        const frutaEncontrada = frutas[index];
        res.send(frutaEncontrada);
    } else {
        res.status(404).send("Fruta no encontrada");
    }
   
});

// Ruta para modificar un producto FUNCIONA PERO CAMBIA TODO
app.put("/:id", (req,res)=>{
    const idFruta = parseInt(req.params.id);
    let frutas = leerFrutas();

    const indiceFruta = frutas.findIndex((fruta)=> fruta.id === idFruta);

    if (indiceFruta !== -1) {
        frutas[indiceFruta] = req.body;
        guardarFrutas(frutas);
        res.send("Fruta modificada exitosamente");
    } else {
        res.status(404).send("Fruta no encontrada")
    }
});

//Ruta para elimiar un producto existente FUNCIONA
app.delete("/:id", (req,res)=>{
    const idFruta = parseInt(req.params.id);
    let frutas = leerFrutas();

    const indiceFruta = frutas.findIndex((fruta)=> fruta.id === idFruta);

    if (indiceFruta !== -1) {
        frutas.splice(indiceFruta,1)
        guardarFrutas(frutas);
        res.send("Fruta eliminada exitosamente");
    } else {
        res.status(404).send("Fruta no encontrada")
    }
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
    res.status(404).send("Lo sentimos, la página que buscas no existe.");
  });
  

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});