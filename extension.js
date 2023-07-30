const vscode = require("vscode");
const axios = require("axios");
const xmlParser = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const url = "https://blog.webdevsimplified.com/rss.xml";

  try {
    const response = await axios.get(url);
    const articles = parseXml(response.data);

    let disposable = vscode.commands.registerCommand(
      "blog-search.searchBlog",
      async function () {
        const blog = await vscode.window.showQuickPick(articles, {
          matchOnDetail: true,
        });

        if (blog) {
          vscode.env.openExternal(vscode.Uri.parse(blog.link));
        }
      }
    );

    context.subscriptions.push(disposable);
  } catch (error) {
    console.error("Error fetching blog data:", error.message);
  }
}

/**
 * Parse XML data and extract relevant article information.
 * @param {string} xmlData - The XML data to parse.
 * @returns {Object[]} - An array of article objects with label, link, and detail properties.
 */
function parseXml(xmlData) {
  const parsedData = xmlParser.parse(xmlData);
  if (!parsedData || !parsedData.rss || !parsedData.rss.channel || !parsedData.rss.channel.item) {
    return [];
  }

  return parsedData.rss.channel.item.map((item) => ({
    label: item.title,
    link: item.link,
    detail: item.description,
  }));
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
