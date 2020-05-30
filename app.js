const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path");
const PORT = process.env.PORT || 3000
const app = express();
const mongoose = require('mongoose');

const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const User = require("./models/user");

const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
	allowProtoPropertiesByDefault: true,
	allowedProtoProperties: true,
	allowProtoMethodsByDefault: true

});

app.use( async (req, res, next) => {
	try {
		const user = await User.findById("5ed04e0f5e6343241ced2a8b");
		req.user = user;
		next();
	}
	catch(err) {
		console.log(err)
	}
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

async function start() {

	try {
		const url = "mongodb://localhost:27017/shop";

		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
	
		const candidate = await User.findOne();

		if(!candidate) {
			const user = new User({
				email: "vedmedenko@gmail.com",
				name: "Nikita",
				cart: { items: [] }
			});

			await user.save();
		}

		app.listen(PORT, () => {
			console.log(`Server is starting on port: ${PORT}`)
		});
	}
	catch(err) {
		console.log(err);
	}
}

start();
