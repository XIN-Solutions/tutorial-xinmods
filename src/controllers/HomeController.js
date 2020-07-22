const Articles = require('../services/Articles.js');

/**
 * Homepage controller
 */
module.exports = {
	
	async index(req, resp) {
		resp.render("homepage", {
			articles: await Articles.getLatestArticles(6)
		});
	},
	
}
