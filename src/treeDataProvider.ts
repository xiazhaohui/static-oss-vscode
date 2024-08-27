import {
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from "vscode";
import { Speaker } from "./types/speaker";
import { Topic } from "./types/topic";

export class TopicsDataProvider implements TreeDataProvider<Speaker | Topic> {
  getTreeItem(element: Speaker | Topic): TreeItem | Thenable<TreeItem> {
    if (element instanceof Speaker) {
      const treeItem = new TreeItem(
        element.name,
        TreeItemCollapsibleState.Collapsed
      );
      treeItem.iconPath = new ThemeIcon("account");
      treeItem.command = {
        command: "treeViewDemo.openProfile",
        title: "Open githubProfile",
        arguments: [element],
      };
      treeItem.contextValue = "speaker";

      return treeItem;
    } else if (element instanceof Topic) {
      const treeItem = new TreeItem(element.topic);
      treeItem.iconPath = new ThemeIcon("book");

      return treeItem;
    }

    throw new Error("getTreeItem 方法未执行");
  }

  getChildren(element?: Speaker): ProviderResult<(Speaker | Topic)[]> {
    if (!element) {
      const speakers: any[] = require("../resources/speakers.json");
      return speakers.map((item) => {
        return new Speaker(item.id, item.name, item.github);
      });
    }

    const speakerId = element.id;
    const topics: any[] = require("../resources/topics.json");
    return topics
      .filter((item) => {
        return item.speakerId === speakerId;
      })
      .map((item) => {
        return new Topic(item.id, item.topic);
      });
  }
}
