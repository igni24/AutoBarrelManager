// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx'];

const createBarrelFile = (directoryPath) => {
	const barrelFilePath = path.join(directoryPath, "index.js");

	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			vscode.window.showErrorMessage(`Error reading directory: ${err}`);
			return;
		}

		const filteredFiles = files.filter(
			file =>
				allowedExtensions.includes(path.extname(file)) &&
				path.basename(file) !== 'index.js'
		);

		const exports = filteredFiles
			.map(file => `export * from "./${path.basename(file, path.extname(file))}";`)
			.join('\n');

		fs.writeFile(barrelFilePath, exports, 'utf8', (err) => {
			if (err) {
				vscode.window.showErrorMessage(`Error writing barrel file: ${err}`);
				return;
			}
		});
	});
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "autobarrelmanager" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('autobarrelmanager.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from AutoBarrelManager!');
	// });

	// context.subscriptions.push(disposable);


	const disposable = vscode.commands.registerCommand('autobarrelmanager.create', () => {
		const filePath = vscode.window.activeTextEditor.document.fileName;
		const directoryPath = path.dirname(filePath);

		createBarrelFile(directoryPath);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
