import { mergeStyleSets, TooltipDelay, TooltipHost } from "@fluentui/react";
import { Checkbox } from "@material-ui/core";
import {
  DescriptionOutlined,
  NoteOutlined,
  PaymentOutlined,
  PhotoOutlined,
  PrintDisabledOutlined,
} from "@material-ui/icons";
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
      maxHeight: "25.px",
    },
  });

  const renderCheckBoxes = () => {
    // console.log(props.currentNode.EntityType);
    if (props.currentNode.EntityType == "nmc_equipmentbuilderline") {
      return (
        <>
          <TooltipHost content='Print Description' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<DescriptionOutlined />}
                icon={<DescriptionOutlined />}
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
                checkedIcon={<PhotoOutlined />}
                icon={<PhotoOutlined />}
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
                checkedIcon={<NoteOutlined />}
                icon={<NoteOutlined />}
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
          <TooltipHost content='Print Price' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<PaymentOutlined />}
                icon={<PaymentOutlined />}
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
          <TooltipHost content='Exclude From Print' delay={TooltipDelay.long}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                color='primary'
                checkedIcon={<PrintDisabledOutlined />}
                icon={<PrintDisabledOutlined />}
                className={styles.checkbox}
                checked={
                  props.currentNode.RTExcludeFromPrint == undefined ||
                  props.currentNode.RTExcludeFromPrint == false
                    ? false
                    : true
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
              checkedIcon={<PaymentOutlined />}
              icon={<PaymentOutlined />}
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
