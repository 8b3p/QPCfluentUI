import { mergeStyleSets, StackItem } from "@fluentui/react";
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
}

const QuoteTreeItem = (props: props) => {
  const vm = useServiceProvider();
  const [childVisible, setChildvisibility] = useState(false);

  const styles = mergeStyleSets({
    StackItem: {
      // backgroundColor: "#a0a0a0",
      marginRight: "1em",
      padding: "0.3em 1em",
      // paddingLeft: `calc(${defaultPaddingLeft}em + ${level * 2}%)`,
      paddingLeft: `${props.level - 1}em`,
      display: "flex",
      justifyContent: "space-between",
    },
    text: {
      fontSize: "1.2rem",
    },
    leftSide: {
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
    // console.log("in level 3");
    // console.log(props.currentNode);
    // console.log(props.currentNode.name);
  }

  return (
    <>
      <StackItem
        onClick={() => {
          vm.onTreeItemClickedHandler(props.currentNode);
        }}
        className={styles.StackItem}
        align='auto'
      >
        <div
          className={styles.leftSide}
          onClick={() => {
            setChildvisibility(!childVisible);
          }}
        >
          {props.currentNode.children ? (
            <ChevronRightMedIcon
              // className={`${styles.icon} ${childVisible ? styles.active : ""}`}
              className={
                styles.icon + " " + (childVisible ? styles.visible : "")
              }
            />
          ) : (
            <div className={styles.dummyIcon} />
          )}
          <div className={styles.text}>{props.currentNode.name}</div>
        </div>
        <ConfigTreeCheckBox
          className={styles["check-boxes"]}
          currentNode={props.currentNode}
        />
      </StackItem>
      {props.currentNode.children && childVisible && (
        <div
          className={
            props.currentNode.children && childVisible
              ? styles.children
              : styles.notChildren
          }
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default observer(QuoteTreeItem);
