import express from 'express';
const app = express();
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';


app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

//El registro de los usuarios debe hacerse con la API Random User usando axios para consultar la data.
const registroUsuarios = [];

app.get('/registrar/usuario', (req, res) => {
    axios
    .get('https://randomuser.me/api/')
    .then((data) => {
        const genderUser = data.data.results[0].gender
        const nameUser = data.data.results[0].name.first
        const lastnameUser = data.data.results[0].name.last
        const idUser = uuidv4().slice(0, 6) // Cada usuario registrado debe tener un campo id único generado por el paquete UUID. 
        const timestampUser = moment().format('MMMM Do YYYY, h:mm:ss a') //Cada usuario debe tener un campo timestamp almacenando la fecha de registro 
                                                                        //obtenida y formateada por el paquete Moment.

        let usuario = {
            gender: genderUser,
            nombre: nameUser,
            apellido: lastnameUser,
            id: idUser, 
            timestamp: timestampUser, 
        };
        registroUsuarios.push(usuario);

        res.setHeader('Content-Type', 'text/html');
        res.write(`<h3>Usuario Registrado Exitosamente: <p> Gender: ${genderUser} - Nombre: ${nameUser} - Apellido: ${lastnameUser} - ID: ${idUser} - Timestamp: ${timestampUser}</p></h3>`);
        res.end();
    })
    .catch((e) => {
        console.log(e);
    })

});

app.get('/consultar/usuario', (req, res) => {
    
    //Por cada consulta realizada al servidor, se debe devolverle al cliente una lista con los datos de todos los usuarios 
    //registrados usando Lodash para dividir el arreglo en 2 separando los usuarios por sexo
    let [femaleUsers, maleUsers] = _.partition(registroUsuarios, { 'gender': 'female' }); //Lodash partition function()

    //En cada consulta también se debe imprimir por la consola del servidor la misma lista 
    //de usuarios pero con fondo blanco y color de texto azul usando el paquete Chalk. 
    res.setHeader('Content-Type', 'text/html');
    console.log(chalk.blue.bgWhite.bold("Mujeres:"));
    
    res.write(`<h3>Mujeres:</h3>`);
    femaleUsers.forEach((e, index) => {
        console.log(chalk.blue.bgWhite.bold(`${index + 1}. Nombre: ${e.nombre} - Apellido: ${e.apellido} - ID: ${e.id} - Timestamp: ${e.timestamp}`));
        res.write((`<p>${index + 1}. Nombre: ${e.nombre} - Apellido: ${e.apellido} - ID: ${e.id} - Timestamp: ${e.timestamp}</p>`));
    });

    console.log(chalk.blue.bgWhite.bold("Hombres:"));
    res.write(`<h3>Hombres:</h3>`);
    maleUsers.forEach((e, index) => {
        console.log(chalk.blue.bgWhite.bold(`${index + 1}. Nombre: ${e.nombre} - Apellido: ${e.apellido} - ID: ${e.id} - Timestamp: ${e.timestamp}`));
        res.write((`<p>${index + 1}. Nombre: ${e.nombre} - Apellido: ${e.apellido} - ID: ${e.id} - Timestamp: ${e.timestamp}</p>`));
    });
       
    res.end()
    
});
//El servidor debe ser levantado con el comando Nodemon.
//nodemon app.js

app.get("*", (req, res) => {
    res.send("<h1>404 - Página no encontrada</h1><p>Lo siento, la página que buscas no existe.</p>");
});