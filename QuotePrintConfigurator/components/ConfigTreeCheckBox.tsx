import { mergeStyleSets, TooltipDelay, TooltipHost } from "@fluentui/react";
import {
  KnowledgeArticleIcon,
  MoneyIcon,
  Photo2Icon,
  PrintIcon,
  QuickNoteIcon,
} from "@fluentui/react-icons-mdl2";
import Checkbox from "@material-ui/core/Checkbox";
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
      alignSelf: "center",
    },
    "icon-container": {
      width: "0",
      height: "0",
      margin: "0",
      padding: "0",
    },
    checkboxWrapper: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      maxWidth: "30px",
      maxHeight: "25px",
    },
  });

  const renderCheckBoxes = () => {
    if (props.currentNode.EntityType == "nmc_equipmentbuilderline") {
      return (
        <>
          <TooltipHost content='Print Description' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<KnowledgeArticleIcon />}
                icon={<KnowledgeArticleIcon />}
                checked={
                  props.currentNode.RTPrintDescription == undefined ||
                  props.currentNode.RTPrintDescription == false
                    ? false
                    : true
                }
                className={styles.checkbox}
                onClick={() =>
                  vm.onCheckBoxCheckedHandler("Description", props.currentNode)
                }
              />
            </div>
          </TooltipHost>
          <TooltipHost content='Print Photos' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<Photo2Icon />}
                icon={<Photo2Icon />}
                className={styles.checkbox}
                checked={
                  props.currentNode.RTPrintPhotos == undefined ||
                  props.currentNode.RTPrintPhotos == false
                    ? false
                    : true
                }
                onClick={() =>
                  vm.onCheckBoxCheckedHandler("Photos", props.currentNode)
                }
              />
            </div>
          </TooltipHost>
          <TooltipHost content='Print Note' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<QuickNoteIcon />}
                icon={<QuickNoteIcon />}
                className={styles.checkbox}
                checked={
                  props.currentNode.RTPrintNote == undefined ||
                  props.currentNode.RTPrintNote == false
                    ? false
                    : true
                }
                onClick={() =>
                  vm.onCheckBoxCheckedHandler("Note", props.currentNode)
                }
              />
            </div>
          </TooltipHost>
          <TooltipHost content='Include In Print' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<PrintIcon />}
                icon={<PrintIcon />}
                className={styles.checkbox}
                checked={
                  props.currentNode.RTExcludeFromPrint == undefined ||
                  props.currentNode.RTExcludeFromPrint == false
                    ? true
                    : false
                }
                onClick={() =>
                  vm.onCheckBoxCheckedHandler(
                    "ExcludeFromPrint",
                    props.currentNode
                  )
                }
              />
            </div>
          </TooltipHost>
        </>
      );
    } else if (props.currentNode?.EntityType == "quotedetail") {
      return (
        <TooltipHost content='Print Price' delay={TooltipDelay.long}>
          <div className={styles.checkboxWrapper}>
            <Checkbox
              color='primary'
              checkedIcon={<MoneyIcon />}
              icon={<MoneyIcon />}
              className={styles.checkbox}
              checked={
                props.currentNode.RTPrintPrice == undefined ||
                props.currentNode.RTPrintPrice == false
                  ? false
                  : true
              }
              onClick={() =>
                vm.onCheckBoxCheckedHandler("Price", props.currentNode)
              }
            />
          </div>
        </TooltipHost>
      );
    }
  };

  return <div className={props.className}>{renderCheckBoxes()}</div>;
};

export default observer(ConfigTreeCheckBox);
