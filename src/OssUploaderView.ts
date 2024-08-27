import * as vscode from "vscode";
import * as path from "path";

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

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileItem): Thenable<FileItem[]> {
    return Promise.resolve(this.files);
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
  public iconPath: { light: string; dark: string };

  constructor(
    public readonly label: string,
    public readonly filePath: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    // 根据文件类型设置不同的 icon
    this.iconPath = {
      light: path.join(
        __filename,
        "..",
        "..",
        "resources",
        "light",
        "file.svg"
      ),
      dark: path.join(__filename, "..", "..", "resources", "dark", "file.svg"),
    };

    // 现在初始化 tooltip 属性
    this.tooltip = `${this.label} - ${this.filePath}`;
  }
}
