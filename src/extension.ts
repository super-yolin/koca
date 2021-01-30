'use strict';

import * as vscode from 'vscode';

const TAG = 'Koca';

const insertText = (val: string, moveCursor?: boolean) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const end = selection.end;

  editor
    .edit((editBuilder) => editBuilder.insert(end, val))
    .then(() => {
      if (moveCursor) {
        var newPosition = new vscode.Position(end.line, val.length - 2);
        var newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
      }
    });
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
              const text = `console.log('${TAG}: ${word} ', ${word});`;
              insertText(text);
            });
        else {
          vscode.commands
            .executeCommand('editor.action.insertLineAfter')
            .then(() => {
              const text = `console.log('${TAG}: ', );`;
              insertText(text, true);
            });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
