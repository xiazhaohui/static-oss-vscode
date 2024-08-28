import * as vscode from "vscode";
import { FileItem, OssUploaderViewProvider } from "./OssUploaderView";
import { createReadStream } from "fs";
import { Speaker } from "./types/speaker";
import { TreeDemoProvider } from "./treeDemoProvider";
import OSS from "ali-oss";
// import {
//   OSS_ACCESS_KEY_ID,
//   OSS_ACCESS_KEY_SECRET,
//   OSS_BUCKET,
//   OSS_ENDPOINT,
//   OSS_REGION,
// } from "./constants/oss";
import path from "path";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("test.one", () => {
      vscode.window.showInformationMessage("命令-1：提示信息");
      console.log("命令-1:日志信息");
    }),

    vscode.commands.registerCommand("treeDemo.openUrl", (s: Speaker) => {
      vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(s.github));
    }),
    vscode.commands.registerCommand("treeDemo.addEntry", () => {
      vscode.window.showInformationMessage("添加一个Item");
      console.log("添加一个Item");
    }),
    vscode.commands.registerCommand("treeDemo.uploadFile", async () => {
      vscode.window.showInformationMessage("上传文件");
      console.log("上传文件");
      uploadFileToOSS();
    }),
    vscode.commands.registerCommand("treeDemo.deleteFile", () => {
      vscode.window.showInformationMessage("删除文件");
      console.log("删除文件");
    }),

    vscode.window.registerTreeDataProvider(
      "tree-demo-view-one",
      new TreeDemoProvider()
    ),
    vscode.window.registerTreeDataProvider(
      "tree-demo-view-two",
      new OssUploaderViewProvider()
    )
  );
}

async function uploadFileToOSS() {
  // 显示文件选择对话框
  const uri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select a file",
    filters: {
      Images: ["jpg", "jpeg", "png", "gif"],
      Videos: ["mp4", "mov", "avi"],
    },
  });

  if (!uri?.length) {
    return; // 如果没有选择文件，则直接返回
  }
  const [selectedFile] = uri;
  // const fileStream = createReadStream(selectedFile.fsPath);
  const fileName = vscode.workspace.asRelativePath(selectedFile.fsPath);
  const name = path.basename(fileName);
  const remotePath = `${new Date().getTime()}-${name}`;
  // const fileName = path.basename(fileStream.path as string);
  console.log("选择的文件流", selectedFile.fsPath, remotePath, fileName);

  // const client = new OSS({
  //   accessKeyId: OSS_ACCESS_KEY_ID,
  //   accessKeySecret: OSS_ACCESS_KEY_SECRET,
  //   bucket: OSS_BUCKET,
  //   endpoint: OSS_ENDPOINT,
  // });
  // const result = await client.put(selectedFile.fsPath, remotePath);
  // console.log("上传完成", result);
}

export function deactivate() {}
