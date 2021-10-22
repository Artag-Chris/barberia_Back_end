import express from 'express';
//estas son las nuevas funciones que usa firebase-9 se importan de la firestore
import { doc, collection, addDoc, getDocs, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import cors from 'cors';
import { db } from "./config/firebaseconfing.js"

const app = express();
const PORT = process.env.PORT || 5000;
const refcliente = collection(db, "cliente")

//se pone en linea el server
app.listen(PORT, (req, res) => {
    try {
        res.send(`Connected to  localhost//${PORT}`)
    } catch (error) {

    }
})

app.set("views", "./views");
app.set("view engine", "ejs");
//esta ultima es para colocar css a sitios estaticos mientras hace render
app.use(express.static("./styles"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


//en la raiz del server  toda peticion que se genere al server se le enviara
//al index.ejs 
//aqui se coje la informacion de la base datos todos los clientes que hay en la lista clientes
//y se los pasa como props a el index.ejs como un objeto que contiene varios elementos 
//y por eso se usa un archivo .ejs para renderizar esa info y volverla visible usando html
app.get("/", (req, res) => {
    try {
        const getClient = async () => {
            const dataClient = await getDocs(refcliente)
            const { docs } = dataClient
            const cliente = docs.map(client => ({ id: client.id, datos: client.data() }))
            //  res.send({cliente}) esta opcion se activa cuando este conectada al front
           // res.render("index", { cliente }) //esta opcion se desactiva cuando este el front
           res.status(200).json({cliente});
        }
        getClient()

    } catch (error) {
        res.send("no data found")
    }
})
//ruta para recojer los datos de los barberos
app.get("/barberos", (req, res) => {
    try {

        const getBarber = async () => {
            const refBarbero = collection(db, "barberos")
            const dataBarber = await getDocs(refBarbero)
            const { docs } = dataBarber
            const barberos = docs.map(barber => ({ id: barber.id, datos: barber.data() }))
            //console.log(barberos)
            //  res.send( barbero}) esta opcion se activa cuando este conectada al front
           // res.render("barberos", { barberos }) //esta opcion se desactiva cuando este el front
            res.status(200).json({barberos})
        }
        getBarber()
    } catch (error) {
        res.send("no data found")
    }
})
//esta ruta pasara los datos de los barberos para agendar citas con ellos en especifico
app.get("/citas", (req, res) => {
    try {

        const getBarber = async () => {
            const refBarbero = collection(db, "barberos")
            const dataBarber = await getDocs(refBarbero)
            const { docs } = dataBarber
            const barberos = docs.map(barber => ({ id: barber.id, datos: barber.data() }))
            //console.log(barberos)
            //  res.send( barbero}) esta opcion se activa cuando este conectada al front
            res.render("citas", { barberos }) //esta opcion se desactiva cuando este el front
        }
        getBarber()
    } catch (error) {
        res.send("no data found")
    }
})
app.get("/getcitas", (req, res) => {
    try { 

        const getCitas = async () => {
            const refCitas = collection(db, "citas")
            const dataCitas = await getDocs(refCitas)
            const { docs } = dataCitas
            const citas = docs.map(cita => ({ id: cita.id, datos: cita.data() }))
            //console.log(cita)
            //  res.send({cita}) esta opcion se activa cuando este conectada al front
            res.status(200).json({citas})
            //res.render("getcitas", { citas }) //esta opcion se desactiva cuando este el front
        }
        getCitas()
    } catch (error) {
        res.send("no data found")
    }
})
//esta ruta lo que hace es crear nuevos clientes y almacenarlos en la base de datos
//usa el formulario que esta escrito en el index.ejs y el metodo post html 
//se pide el request.body."atributo" este request lo envia el formulario que hay en 
//el index.ejs
app.post("/add", (req, res) => {
   
    const text = req.body
    try {
        const cliente = {
            nombres: req.body.nombres,
            apellido: req.body.apellido,
            email: req.body.email,
            telefono: req.body.telefono,
            documento: req.body.documento, 
            comentario: req.body.comentario 
        }
        console.log(text)
        const refcliente = collection(db, "cliente")
        const newClient = async () => {
            await addDoc(refcliente, cliente);
        }
        newClient()
        //es activa esta opcion cuandoeste el front-end// res.send("data base updated ")
       // res.redirect("/") //se desactiva esta opcion cuando este el front-end
       res.status(201).json({text})
    } catch (error) {
        res.send(error)
    }
})
//ruta para agregar barberos a la base de datos 
//tiene una lista distinta a la de clientes pero usara casi el mismo codigo
app.post("/add/barber", (req, res) => {
    try {
        const barbero = {
            nombres: req.body.nombres,
            apellido: req.body.apellido,
            email: req.body.email,
            telefono: req.body.telefono,
            documento: req.body.documento,
            experiencia: req.body.experiencia
        }

        console.log(barbero)
        const refBarbero = collection(db, "barberos")
        const newBarber = async () => {
            await addDoc(refBarbero, barbero);
            console.log("new barber on data base")
            res.status(201).json({barbero})
        }
        newBarber()
        //es activa esta opcion cuandoeste el front-end// res.send("data base updated ")
       // res.redirect("/") //se desactiva esta opcion cuando este el front-end
    } catch (error) {
        res.send(error)
    }
})
//esta ruta es para agendar citas a la base de datos
app.post("/add/citas", (req, res) => {
    try {
        const newAppointment = {
            nombreBarbero: req.body.nombreBarbero,
            fecha: req.body.fecha, 
            hora: req.body.hora
        }
        console.log(newAppointment)
        const refCitas = collection(db, "citas")
        const newCita = async () => {
            await addDoc(refCitas, newAppointment);
            console.log("new date updated")
            res.status(201).json({newAppointment})
        }
        newCita()
        //es activa esta opcion cuandoeste el front-end// res.send("data base updated ")
        //res.redirect("/") //se desactiva esta opcion cuando este el front-end
        
    } catch (error) {
        res.send(error)
    }
})

//esta ruta es para borrar informacion pero usa un id
//ese id se imprime cuando se hace el render del objeto en la ruta principal
//ese id debe ser exacto al mismo id que tiene la base de datos o de lo contrario no
//encontrara el archivo que se va a borrar
app.delete("/delete/:id", (req, res) => {
    const parametro = req.params.id
    try {
        const deleteClient = async (id = parametro) => {
            const userDoc = doc(db, "cliente", id)
            await deleteDoc(userDoc)
            res.status(200).send("deleted");
        }
        deleteClient()
        
    } catch (error) {
        res.send("error maybe missing id?")
    }

})
//borrar barbero por id
app.delete("/barberos/delete/:id", (req, res) => {
    const parametro = req.params.id
    // console.log(parametro)
    try {
        const deleteBarber = async (id = parametro) => {
            const userDoc = doc(db, "barberos", id)
            await deleteDoc(userDoc)
            res.status(200).send({});
        }
        deleteBarber()
        res.send("barber dropped")
        // res.redirect("/barberos")
    } catch (error) {
        res.send("error maybe missing id?")
    }

})
//ruta para borrar citas
app.delete("/citas/delete/:id", (req, res) => {
    const parametro = req.params.id
    // console.log(parametro)
    try {
        const deleteCitas = async (id = parametro) => {
            const userDoc = doc(db, "citas", id)
            await deleteDoc(userDoc)  
            res.status(200).json("ok")
            
        }
        deleteCitas()
        
        // res.redirect("/barberos")
    } catch (error) {
        res.send("error maybe missing id?")
    }
})
//esta ruta lo que hace es buscar un cliente en especifico por id
//y nos trae los datos de ese cliente en especifico 
//lo que hice fue pedir los datos por id y despues el objeto que me envio la base de datos
//me toco volverlo un objeto y usar una propia funcion que viene en ese objeto en sus propios
//datos despues le asigne un id que resulta ser el que nos pasan por medio del request
//el req.param.id o parametro 
app.get("/cliente/:id", async (req, res) => {
    try {
        const parametro = req.params.id
        const docRef = doc(db, "cliente", parametro);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const clienteInfo = { "datos": docSnap.data(), "id": parametro }
            res.render("cliente", { clienteInfo })
        }
    } catch (error) {
        res.send("no such document or maybe id error")
    }
})
//busca barbero por id 
app.get("/barberos/:id", async (req, res) => {
    try {
        const parametro = req.params.id
        const docRef = doc(db, "barberos", parametro);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const barberoInfo = { "datos": docSnap.data(), "id": parametro }
            res.render("barberosUpdate", { barberoInfo })
        }
    } catch (error) {
        res.send("no such document or maybe id error")
    }
})
//esta ruta hace un update a un cliente de alguno de sus campos menos el id
//me toco crear un formulario propio renderizado para poder pasar los nuevos valores 
//esta parte fue la mas abstracta para mi
app.put("/cliente/post/:id", (req, res) => {

    try {
        const parametro = req.body.id;
        const docRef = doc(db, "cliente", parametro);
        const clientUpdatedInfo = {
            nombres: req.body.nombres,
            apellido: req.body.apellido,
            email: req.body.email,
            telefono: req.body.telefono,
            documento: req.body.documento,
            comentario: req.body.comentario
        }
        console.log(clientUpdatedInfo)
        const updateUser = async () => {
            await updateDoc(docRef, clientUpdatedInfo);

        }
        updateUser()
        res.send("Updated")
    } catch (error) {
        res.send("error maybe id ")
    }
})
//update de barberos
app.put("/barbero/post/:id", (req, res) => {
    try {
        const parametro = req.body.id;
        const docRef = doc(db, "barberos", parametro);
        const barberosUpdatedInfo = {
            nombres: req.body.nombres,
            apellido: req.body.apellido,
            email: req.body.email,
            telefono: req.body.telefono,
            documento: req.body.documento,
            experiencia: req.body.experiencia
        }
        console.log(barberosUpdatedInfo)
        const updateUser = async () => {
            await updateDoc(docRef, barberosUpdatedInfo);

        }
        updateUser()
        res.send("Updated")
    } catch (error) { 
        res.send("error maybe id ") 
    }
})
