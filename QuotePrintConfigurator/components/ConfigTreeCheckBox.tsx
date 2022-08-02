import {
  Checkbox,
  mergeStyleSets,
  TooltipDelay,
  TooltipHost,
} from "@fluentui/react";
import { observer } from "mobx-react-lite";
import React = require("react");
import { RenderTree } from "../Functions/RenderTree";
import { useServiceProvider } from "./context";

interface props {
  className?: string;
  currentNode: RenderTree;
}

const ConfigTreeCheckBox = (props: props) => {
  const vm = useServiceProvider();

  // style={{ //!tooltip
  //   margin: "0",
  //   marginLeft: "-11px",
  // }}

  const styles = mergeStyleSets({
    checkbox: {
      margin: "1%",
    },
    "checkbox:checked": {
      color: "blue",
    },
    "icon-container": {
      width: "0",
      height: "0",
      margin: "0",
      padding: "0",
    },
  });

  const renderCheckBoxes = () => {
    // console.log(props.currentNode.EntityType);
    if (props.currentNode.EntityType == "nmc_equipmentbuilderline") {
      return (
        <>
          <TooltipHost content='Print Description' delay={TooltipDelay.long}>
            <Checkbox
              checkmarkIconProps={{ iconName: "QuickNote" }}
              checked={
                props.currentNode.RTPrintDescription == undefined ||
                props.currentNode.RTPrintDescription == false
                  ? false
                  : true
              }
              onChange={() =>
                vm.onCheckBoxCheckedHandler("Description", props.currentNode)
              }
              className={styles.checkbox}
            />
          </TooltipHost>
          <TooltipHost content='Print Photos' delay={TooltipDelay.long}>
            <Checkbox
              checkmarkIconProps={{ iconName: "Photo2" }}
              checked={
                props.currentNode.RTPrintPhotos == undefined ||
                props.currentNode.RTPrintPhotos == false
                  ? false
                  : true
              }
              onChange={() =>
                vm.onCheckBoxCheckedHandler("Photos", props.currentNode)
              }
              className={styles.checkbox}
            />
          </TooltipHost>
          <TooltipHost content='Print Note' delay={TooltipDelay.long}>
            <Checkbox
              checkmarkIconProps={{ iconName: "EditNote" }}
              checked={
                props.currentNode.RTPrintNote == undefined ||
                props.currentNode.RTPrintNote == false
                  ? false
                  : true
              }
              onChange={() =>
                vm.onCheckBoxCheckedHandler("Note", props.currentNode)
              }
              className={styles.checkbox}
            />
          </TooltipHost>
          <TooltipHost content='Print Price' delay={TooltipDelay.long}>
            <Checkbox
              checkmarkIconProps={{ iconName: "Money" }}
              checked={
                props.currentNode.RTPrintPrice == undefined ||
                props.currentNode.RTPrintPrice == false
                  ? false
                  : true
              }
              onChange={() =>
                vm.onCheckBoxCheckedHandler("Price", props.currentNode)
              }
              className={styles.checkbox}
            />
          </TooltipHost>
          <TooltipHost content='Exclude From Print' delay={TooltipDelay.long}>
            <Checkbox
              checkmarkIconProps={{ iconName: "VisuallyImpaired" }}
              checked={
                props.currentNode.RTExcludeFromPrint == undefined ||
                props.currentNode.RTExcludeFromPrint == false
                  ? false
                  : true
              }
              onChange={() =>
                vm.onCheckBoxCheckedHandler(
                  "ExcludeFromPrint",
                  props.currentNode
                )
              }
              className={styles.checkbox}
            />
          </TooltipHost>
        </>
      );
    } else if (props.currentNode?.EntityType == "quotedetail") {
      return (
        <TooltipHost content='Print Price' delay={TooltipDelay.long}>
          <Checkbox
            checkmarkIconProps={{ iconName: "Money" }}
            checked={
              props.currentNode.RTPrintPrice == undefined ||
              props.currentNode.RTPrintPrice == false
                ? false
                : true
            }
            onChange={() =>
              vm.onCheckBoxCheckedHandler("Price", props.currentNode)
            }
            className={styles.checkbox}
          />
        </TooltipHost>
      );
    }
  };

  return <div className={props.className}>{renderCheckBoxes()}</div>;
};

export default observer(ConfigTreeCheckBox);
