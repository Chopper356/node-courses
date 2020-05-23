const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path");
const PORT = process.env.PORT || 3000
const app = express();

const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");

const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs"
});

//Регистрация в express что у нас есть движок handlebars
app.engine("hbs", hbs.engine);
//Использование движка
app.set("view engine", "hbs");
//Куда буду сохраняться файлы
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);

app.listen(PORT, () => {
	console.log(`Server is starting on port: ${PORT}`)
});