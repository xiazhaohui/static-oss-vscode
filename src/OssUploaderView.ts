import * as vscode from "vscode";
import * as path from "path";
import {
  ProviderResult,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
} from "vscode";

export class OssUploaderViewProvider
  implements vscode.TreeDataProvider<FileItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    FileItem | undefined | void
  > = new vscode.EventEmitter<FileItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<FileItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private files: FileItem[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FileItem): TreeItem {
    console.log("getTreeItem", element);
    const treeItem = new TreeItem(
      element.fileName,
      TreeItemCollapsibleState.Collapsed
    );
    return treeItem;
  }

  getChildren(element?: FileItem): ProviderResult<FileItem[]> {
    vscode.window.showInformationMessage("提示信息-提示信息");
    console.log("getChildren", element);
    /**
     * 文件列表，每个文件为tree的一项，层级只有一层；
     * 文件item的hover操作：复制链接、删除；
     * 文件列表头（Topic Title）有一个按钮，上传文件，点击后触发选择文件弹窗；
     * 选中文件后开始上传，上传成功后展示在文件列表。
     *
     * OSS 配置自定义功能，暂无（考虑做到Topic部分，交互类似选择文件）
     */

    if (!element) {
      const fileLIst: any[] = require("../resources/fileList.json");
      return fileLIst;
    } else {
      return Promise.resolve([]);
    }
  }

  addFile(file: FileItem): void {
    this.files.push(file);
    this.refresh();
  }

  removeFile(file: FileItem): void {
    this.files = this.files.filter((f) => f !== file);
    this.refresh();
  }
}

export class FileItem extends vscode.TreeItem {
  public tooltip: string;
  public contextValue = "fileItem";

  constructor(
    public readonly fileName: string,
    public readonly filePath: string,
    public readonly command?: vscode.Command
  ) {
    super(fileName);

    // 现在初始化 tooltip 属性
    this.tooltip = `${this.fileName} - ${this.filePath}`;
  }
}
