import * as vscode from "vscode";
import OSS from "ali-oss";
import { FileItem, OssUploaderViewProvider } from "./OssUploaderView";
import * as path from "path";
import { TopicsDataProvider } from "./treeDataProvider";
import { Speaker } from "./types/speaker";
const fs = require("fs");

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "treeViewDemo.openProfile",
      (s: Speaker) => {
        vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.parse(s.github)
        );
      }
    ),
    vscode.window.registerTreeDataProvider(
      "treeViewDemo",
      new TopicsDataProvider()
    )
  );
}

export function deactivate() {}
