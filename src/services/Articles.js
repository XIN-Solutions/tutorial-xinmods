const Hippo = require('./Hippo.js');
const BasePath = '/content/documents/site/articles/'
const Markdown = require('markdown');
const _ = require('lodash');

/**
 * Services that interact with Hippo CMS using the XIN Mods package.
 */
module.exports = {
	
	/**
	 * Get an article based on its path
	 * @param path
	 */
	async getArticle(path) {
		const fullPath = `${BasePath}${path}`;
		const doc = await Hippo.getDocumentByPath(fullPath);
		
		if (!doc) {
			return null;
		}
		
		const body = [];
		for (const component of _.values(doc.items.body)) {
			const cmpHtml = await this.mapToHtml(component)
			body.push(cmpHtml);
		}
		
		// convert to useful object.
		return {
			title: doc.items.title,
			description: doc.items.description,
			image: (await Hippo.getImageFromLink(doc.items.image)).scaleWidth(710).toUrl(),
			body: body.join("\n")
		};
	},
	
	
	/**
	 * Get a list of articles
	 * @param maxArticles
	 */
	async getLatestArticles(maxArticles) {
		
		const docs = await Hippo.getDocuments({
			max: maxArticles,
			nodeType: "xinmods:article",
			orderBy: "hippostdpubwf:creationDate"
		});
		
		
		const articles = [];
		for (const item of docs.items) {
			const article = await Hippo.getDocumentByUuid(item.id);
			const {path: articlePath} = await Hippo.uuidToPath(item.id);
			const image = await Hippo.getImageFromLink(article.items.image);
			
			articles.push({
				title: article.items.title,
				description: article.items.description,
				url: articlePath.substring("/content/documents/site".length),
				image: image != null? image.toUrl() : null,
				thumbnail: image != null? image.scaleHeight(200).crop(320, 200).toUrl() : null
			});
		}
		
		return articles;
	},
	
	
	/**
	 * This is only for demonstration purposes. Normally you would have the frontend
	 * handle the decision on how to render certain nodes, by converting these ones into
	 * "view" indicators with their own submodels. But this is just a tutorial ;)
	 *
	 * @param component the component to transform
	 * @returns {Promise<string>} some HTML
	 */
	async mapToHtml(component) {
		if (component.type === "xinmods:text") {
			return `
				<div class="Article__Text">
					${Markdown.parse(component.items.text)}
				</div>
			`;
		}
		
		if (component.type === "xinmods:image") {
			
			const img = await Hippo.getImageFromLink(component.items.Image);
			if (!img) {
				return '';
			}
			
			let caption = "";
			if (component.items.caption) {
				caption = "<p class='Article__ImageCaption'>" + component.items.caption + "</p>";
			}
			
			return `
				<div class="Article__ImageWrapper">
					<img class="Article__Image" src="${img.scaleWidth(710).toUrl()}" alt="${component.items.caption}">
					${caption}
				</div>
			`;
		}
		
		return `<strong>Unknown type: ${component.type}</strong>`
	},
	
	
	
};
