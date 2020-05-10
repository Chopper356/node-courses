const uuid = require('uuid').v4
const fs = require("fs")
const path = require("path")

//Создание класса курса с название, ценой, картинкой и id
class Course {
	constructor(title, price, image) {
		this.title = title
		this.price = price
		this.image = image
		this.id = uuid();
	}

//Возвращение пришедших в класс данных в виде JSON'а
	toJSON() {
		return {
			title: this.title,
			price: this.price,
			image: this.image,
			id: this.id
		}
	}

	static async update(course) {
		let courses = await Course.getAll();

		let idx = courses.findIndex(c => c.id == course.id);

		courses[idx] = course

		return new Promise((resolve, reject) => { 
			fs.writeFile(path.join(__dirname, "..", "data", "courses.json"), JSON.stringify(courses) , (err) => {
				if(err) { 
					reject(err)
				}
				else {
					resolve();
				}
			});
			
		});
	}

	async save() {
		const courses = await Course.getAll(); //Ожидание пока данные прийдут в courses
		courses.push(this.toJSON()); //Записываем пришедшие данные в виде объекта в json

		return new Promise((resolve, reject) => { //Возвращаем объект в функции Promise
			//Записываем новые данные в файл
			fs.writeFile(path.join(__dirname, "..", "data", "courses.json"), JSON.stringify(courses) , (err) => {
				if(err) { 
					reject(err)
				}
				else {
					resolve();
				}
			});
			
		});
	}

// 
	static getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(path.join(__dirname, "..", "data", "courses.json"), "utf-8", (err, content) => {
				if(err) {
					reject(err);
				}
				else {
					resolve(JSON.parse(content));
				}

			})
		})
	}

	static async getById(id) {
		let courses = await Course.getAll();

		return courses.find( c => c.id === id);
	}
}

module.exports = Course
