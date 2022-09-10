import {
  mergeStyleSets,
  StackItem,
  TooltipDelay,
  TooltipHost,
} from "@fluentui/react";
import { ChevronRightMedIcon } from "@fluentui/react-icons-mdl2";
import { observer } from "mobx-react-lite";
import { JSXElementConstructor, ReactElement, useState } from "react";
import React = require("react");
import { RenderTree } from "../Functions/RenderTree";
import ConfigTreeCheckBox from "./ConfigTreeCheckBox";
import { useServiceProvider } from "./context";

interface props {
  currentNode: RenderTree;
  level: number;
  children?: ReactElement<any, string | JSXElementConstructor<any>>[] | null;
  key: string;
}

const QuoteTreeItem = (props: props) => {
  const vm = useServiceProvider();
  const [isExpanded, setIsExpanded] = useState(props.level === 1 && true);

  const styles = mergeStyleSets({
    StackItem: {
      // backgroundColor: "#a0a0a0",
      marginRight: "1em",
      height: "fit-content",
      padding: "0.3em 1em",
      // paddingLeft: `calc(${defaultPaddingLeft}em + ${level * 2}%)`,
      paddingLeft: `${props.level - 1}em`,
      display: "flex",
      justifyContent: "space-between",
    },
    text: {
      fontSize: "14px",
    },
    leftSide: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      maxWidth:
        props.currentNode.EntityType == "quotedetail" ||
        props.currentNode.EntityType == ""
          ? "calc(100% - 2.5em)"
          : "calc(100% - 6.5em)",
      overflow: "hidden",
    },
    icon: {
      padding: "0 0.5em",
      transform: "rotate(90deg)",
      transition: "transform 200ms",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
    },
    visible: {
      transform: "rotate(-90deg)",
      transition: "transform 200ms",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.23, 1)",
    },
    children: {
      display: "block",
      height: "fit-content",
      transition: "height 200ms ease-in-out",
    },
    notChildren: {
      display: "none",
      height: "0",
      transition: "height 200ms ease-in-out, display 200ms",
    },
    "check-boxes": {
      zIndex: "10",
      alignSelf: "center",
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
    },
    dummyIcon: {
      minWidth: "28px",
      height: "10px",
    },
  });

  if (props.level == 3) {
  }

  const renderChildren = (
    nodes: ReactElement<any, string | JSXElementConstructor<any>>[]
  ) => {
    return (
      <div className={isExpanded ? styles.children : styles.notChildren}>
        {nodes}
      </div>
    );
  };

  const renderIcon = () => {
    return props.currentNode.children ? (
      <ChevronRightMedIcon
        className={
          isExpanded ? styles.icon + " " + styles.visible : styles.icon
        }
      />
    ) : (
      <div className={styles.dummyIcon}></div>
    );
  };

  const renderCheckBoxes = () => {
    return (
      <ConfigTreeCheckBox
        className={styles["check-boxes"]}
        currentNode={props.currentNode}
      />
    );
  };

  const renderText = () => {
    return props.level === 3 ? (
      <TooltipHost
        content={props.currentNode.name}
        delay={TooltipDelay.long}
        id={props.currentNode.id}
      >
        <div className={styles.text}>{props.currentNode.name}</div>
      </TooltipHost>
    ) : (
      <div className={styles.text}>{props.currentNode.name}</div>
    );
  };

  return (
    <>
      <StackItem
        className={styles.StackItem}
        align='auto'
        onClick={() => {
          vm.onTreeItemClickedHandler(props.currentNode);
        }}
      >
        <div
          className={styles.leftSide}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {renderIcon()}
          {renderText()}
        </div>
        {renderCheckBoxes()}
      </StackItem>
      {props.children && renderChildren(props.children)}
    </>
  );
};

export default observer(QuoteTreeItem);
