const Articles = require('../services/Articles.js');
const Hippo = require('../services/Hippo.js');
const _ = require('lodash');

module.exports = {
	
	/**
	 * Render the page.
	 * @param req
	 * @param resp
	 * @returns {Promise<void>}
	 */
	async index(req, resp) {
		try {
			resp.render("article", {
				article: await Articles.getArticle(req.params.page)
			});
		}
		catch (ex) {
			resp.status(500).send(ex);
		}
	}
	
}
