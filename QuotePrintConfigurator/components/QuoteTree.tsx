import { observer } from "mobx-react-lite";
import React = require("react");
import { RenderTree } from "../types/RenderTree";
import { useServiceProvider } from "./context";
import QuoteTreeItem from "./QuoteTreeItem";

interface props { }

const QuoteTree = (props: props) => {
  const vm = useServiceProvider();

  const renderTree = (node: RenderTree, level: number): React.ReactElement => {
    return (
      <QuoteTreeItem key={node.id} level={level} currentNode={node}>
        {Array.isArray(node.children)
          ? node.children?.map(node => renderTree(node, level + 1))
          : null}
      </QuoteTreeItem>
    );
  };

  return <>{renderTree(vm.items, 1)}</>;
};

export default observer(QuoteTree);
