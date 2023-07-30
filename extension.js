const vscode = require("vscode")
const axios = require("axios")
const xmlParser = require("fast-xml-parser")
const https = require("https")

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

  const url = "https://blog.webdevsimplified.com/rss.xml"

  const res = await axios.get(url)

  const articles = xmlParser.parse(res.data).rss.channel.item.map(i => {
    return {
      label: i.title,
      link: i.link,
      detail: i.description,
    }
  })


  let disposable = vscode.commands.registerCommand(
    "blog-search.searchBlog",
    async function () {
      const blog = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true
      })

      if (!blog) return

      vscode.env.openExternal(vscode.Uri.parse(blog.link))

    }

  )

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() { }

module.exports = {
  activate,
  deactivate,
}
