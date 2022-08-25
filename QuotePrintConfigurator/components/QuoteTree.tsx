import { mergeStyleSets } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import React = require("react");
import { RenderTree } from "../Functions/RenderTree";
import { useServiceProvider } from "./context";
import QuoteTreeItem from "./QuoteTreeItem";

interface props {}

const QuoteTree = (props: props) => {
  const vm = useServiceProvider();

  const renderTree = (node: RenderTree, level: number): React.ReactElement => {
    return (
      <div key={node.id}>
        <QuoteTreeItem level={level} currentNode={node}>
          {Array.isArray(node.children)
            ? node.children?.map(node => renderTree(node, level + 1))
            : null}
        </QuoteTreeItem>
      </div>
    );
  };

  const styles = mergeStyleSets({
    Stack: {},
    Container: {
      height: "fit-content",
    },
  });
  return (
    <div className={styles.Container}>
      <div className={styles.Stack}>{renderTree(vm.items, 1)}</div>
    </div>
  );
};

export default observer(QuoteTree);
