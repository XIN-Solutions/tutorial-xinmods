const Articles = require('../services/Articles.js');

/**
 * Homepage controller
 */
module.exports = {
	
	async index(req, resp) {
		try {
			resp.render("homepage", {
				articles: await Articles.getLatestArticles(6)
			});
		}
		catch (ex) {
			console.error(ex);
			resp.status(500).send("Something went wrong");
		}
	},
	
}
