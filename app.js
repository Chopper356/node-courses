const express = require("express")
const exphbs = require("express-handlebars");
const path = require("path");
const csrf = require("csurf");
const PORT = process.env.PORT || 3000
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const User = require("./models/user");
const coursesRoutes = require("./routes/courses");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const varMidleware = require("./middleware/variables");
const userMiddleWare = require("./middleware/user");

const MONGODB_URI = "mongodb://localhost:27017/shop";

const store = new MongoStore ({
	collection: "sessions",
	uri: MONGODB_URI,
});

const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
	allowProtoPropertiesByDefault: true,
	allowedProtoProperties: true,
	allowProtoMethodsByDefault: true

});

//Регистрация в express что у нас есть движок handlebars
app.engine("hbs", hbs.engine);
//Использование движка
app.set("view engine", "hbs");
//Куда буду сохраняться файлы
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(session ({
	secret: "vlas lox",
	resave: false,
	saveUninitialized: false,
	store
}));
app.use(csrf());
app.use(varMidleware);
app.use(userMiddleWare);

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

async function start() {

	try {

		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		
		app.listen(PORT, () => {
			console.log(`Server is starting on port: ${PORT}`)
		});
	}
	catch(err) {
		console.log(err);
	}
}

start();
