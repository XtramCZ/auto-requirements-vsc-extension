// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "python-requirements-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('python-requirements-generator.Generate', function () {
		vscode.workspace.findFiles('*.py').then((files) => {
			var modules = ""
			files.forEach((file) => {
				data = fs.readFileSync(file.fsPath, 'utf8')
				const regex = new RegExp("import")
				const lines = data.split("\n")
				const matches = lines.filter(line => regex.test(line))
				matches.forEach((match) => {
					if(match.includes("from")){
						modules = modules + match.split(" ")[1] + "\n"
					} else {
						match = match.replace(/\s/g, "").replace("import", "")
						if(match.includes(",")){
							match.split(",").forEach((m) => {
								modules = modules + m.trim() + "\n"
							})
						} else {
							modules = modules + match + "\n"
						}
					}
				})
			})
		const filePath = vscode.Uri.file(`${vscode.workspace.workspaceFolders[0].uri.fsPath}/requirements.txt`);
		vscode.workspace.fs.writeFile(filePath, new TextEncoder().encode(modules))
		})
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Successfully generated a requirements.txt file!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
