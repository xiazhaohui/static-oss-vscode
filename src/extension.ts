// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import OSS from "ali-oss";
import { FileItem, OssUploaderViewProvider } from "./OssUploaderView";
import * as path from "path";
const fs = require("fs");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("恭喜你，插件激活成功！");

  // 创建 TreeDataProvider 实例
  const ossUploaderViewProvider = new OssUploaderViewProvider();

  // 注册 TreeDataProvider
  vscode.window.registerTreeDataProvider(
    "ossUploaderView",
    ossUploaderViewProvider
  );

  // 注册上传文件命令
  const uploadFileCommond = vscode.commands.registerCommand(
    "ossUploader.uploadFile",
    async () => {
      const files = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select file to upload",
      });

      if (files && files.length > 0) {
        const filePath = files[0].fsPath;
        const config = vscode.workspace.getConfiguration("ossConfig");
        uploadToOSS(filePath, config, ossUploaderViewProvider);
      }
    }
  );
  context.subscriptions.push(uploadFileCommond);

  // 注册配置命令
  const configureCommond = vscode.commands.registerCommand(
    "ossUploader.configure",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "ossUploaderConfigure",
        "Configure OSS Settings",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage((message) => {
        if (message.command === "saveConfig") {
          saveConfig(message.data);
        }
      });
    }
  );
  context.subscriptions.push(configureCommond);
}

function getWebviewContent(): string {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OSS Settings</title>
      </head>
      <body>
          <h1>OSS Configuration</h1>
          <form id="ossForm">
              <label for="bucket">Bucket:</label>
              <input type="text" id="bucket" name="bucket" required><br><br>
              <label for="region">Region:</label>
              <input type="text" id="region" name="region" required><br><br>
              <label for="accessKeyId">Access Key ID:</label>
              <input type="text" id="accessKeyId" name="accessKeyId" required><br><br>
              <label for="accessKeySecret">Access Key Secret:</label>
              <input type="password" id="accessKeySecret" name="accessKeySecret" required><br><br>
              <button type="button" onclick="saveConfig()">Save</button>
          </form>
          <script>
              const vscode = acquireVsCodeApi();
              function saveConfig() {
                  const form = document.getElementById('ossForm');
                  const data = {
                      bucket: form.bucket.value,
                      region: form.region.value,
                      accessKeyId: form.accessKeyId.value,
                      accessKeySecret: form.accessKeySecret.value
                  };
                  vscode.postMessage({ command: 'saveConfig', data: data });
              }
          </script>
      </body>
      </html>
  `;
}

function saveConfig(data: any) {
  vscode.workspace
    .getConfiguration()
    .update("ossConfig", data, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage("OSS configuration saved!");
}

async function uploadToOSS(
  filePath: string,
  config: any,
  ossUploaderViewProvider: OssUploaderViewProvider
) {
  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
  });

  const fileName = path.basename(filePath);
  try {
    const result = await client.put(fileName, filePath);
    vscode.window.showInformationMessage(
      `File uploaded successfully: ${result.url}`
    );
    ossUploaderViewProvider.addFile(
      new FileItem(fileName, result.url, vscode.TreeItemCollapsibleState.None, {
        command: "ossUploader.copyLink",
        title: "Copy Link",
        arguments: [result.url],
      })
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to upload file: ${error}`);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
