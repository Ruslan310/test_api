require('dotenv').config()
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path')
const PORT = process.env.PORT || 4000


const app = express()
app.use(cors())
app.use("/img", express.static(__dirname + '/img'))
const jsonParser = express.json()
/** Проверка работоспособности */
app.get("/", function (req, res) {
   res.json('Welcome to API')
});

/** Выставление JSON по API*/
const filePath = "menu.json";
app.get("/api/menu", function(req, res){
   const content = fs.readFileSync(filePath,"utf8");
   const users = JSON.parse(content);
   res.send(users);
});



/** Запись заказа в JSON по API*/
app.get("/api/users", jsonParser, function (req, res){

   if(!req.body) return res.sendStatus(400);

   const userName = req.body.name;
   const userAge = req.body.age;
   let user = {name: userName, age: userAge};

   let data = fs.readFileSync(filePath, "utf8");
   let users = JSON.parse(data);

   // находим максимальный id
   const id = Math.max.apply(Math,users.map(function(o){return o.id;}))
   // увеличиваем его на единицу
   user.id = id+1;
   // добавляем пользователя в массив
   users.push(user);
   data = JSON.stringify(users);
   // перезаписываем файл с новыми данными
   fs.writeFileSync("users.json", data);
   res.send(user);
});


/** Port Listen */
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})