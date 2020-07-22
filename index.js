const express = require('express');
const hbs = require('express-hbs');

const app = express();


/**
 * Configure the handlebars engine
 */
const rootFolder = __dirname;

app.engine('hbs', hbs.express4({
	partialsDir: rootFolder + '/views/partials',
	layoutsDir: rootFolder + '/views/layouts',
	cache: true
}));

app.set('view engine', 'hbs');
app.set('views', rootFolder + '/views/pages');

/**
 * Configure loading of assets
 */
app.use(`/assets`, express.static('assets'));

/**
 * Homepage route
 */
app.get('/home', async (req, resp) => {
	const HomeController = require('./src/controllers/HomeController.js');
	await HomeController.index(req, resp);
});


/**
 * Article route
 */
app.get('/articles/:page(*)', async (req, resp) => {
	const ArticleController = require('./src/controllers/ArticleController.js');
	await ArticleController.index(req, resp);
});

app.all('/*', (req, resp) => {
	resp.status(404).send("Not found.");
});

app.listen(9090);
console.log("Running op port 9090");
