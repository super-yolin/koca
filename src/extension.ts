'use strict';

import * as vscode from 'vscode';

const TAG = 'Koca';
const kcRegex = /((\`)Koca: .*L \d*.*(\`))/;
const kcRegexRpl = /(\`)Koca: .*L \d*/;

const insertText = (val: string) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selection = editor.selection;

  editor.edit((editBuilder) => {
    editBuilder.insert(selection.end, val);
  });
};

const getPath = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const workspaceFolders: ReadonlyArray<vscode.WorkspaceFolder> | undefined =
      vscode.workspace.workspaceFolders;
    let fileName = document.fileName;

    if (workspaceFolders) {
      let folderPath = workspaceFolders[0].name;
      let regex = new RegExp('.*/' + folderPath);
      fileName = fileName.replace(regex, '');
    }
    return fileName;
  }
  return '';
};

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.insertConsole',
    function () {
      // 获取激活的 tab 编辑窗口
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        // 获取文档
        const document = editor.document;
        let fileName = getPath();

        // 获取选中文档
        const selection = editor.selection;
        const end = selection.end;

        let position = new vscode.Position(end.line + 1, 0);
        // Get the word within the selection
        const word = document.getText(selection);

        if (word)
          vscode.commands
            .executeCommand('editor.action.insertLineAfter')
            .then(() => {
              const text = `console.log(\`${TAG}: ${fileName}, L ${
                position.line + 1
              }, ${word}:  \$\{${word}\}\`);`;
              insertText(text);
            });
        else {
          vscode.commands
            .executeCommand('editor.action.insertLineAfter')
            .then(() => {
              const text = `console.log(\`${TAG}: ${fileName}, L ${
                position.line + 1
              } \`);`;
              insertText(text);
            });
        }
      }
    }
  );

  const syncLineNumber = vscode.workspace.onWillSaveTextDocument((e) => {
    const document = e.document;
    const editor = vscode.window.activeTextEditor;

    if (document.languageId !== 'javascript' || !editor) {
      return;
    }

    let fileName = getPath();
    let lineNumberArr: Array<number> = [];
    for (let i = 0; i <= document.lineCount - 1; i++) {
      let line = document.lineAt(i);
      let text = line.text;
      let regTest = kcRegex.test(text);
      if (regTest) {
        lineNumberArr.push(i);
      }
    }
    editor.edit((editBuilder) => {
      for (let index of lineNumberArr) {
        let range = document.lineAt(index).range;
        let text = document.lineAt(index).text;
        let textRpl = `\`${TAG}: ${fileName}, L ${index + 1}`;

        if (!text.includes(textRpl)) {
          let textRep = text.replace(kcRegexRpl, textRpl);
          editBuilder.replace(range, textRep);
        }
      }
    });
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(syncLineNumber);
}
