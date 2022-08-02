import { Label, mergeStyleSets, TextField } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import React = require("react");
import { useServiceProvider } from "./context";

interface props {}

const QuoteDetails = () => {
  const vm = useServiceProvider();

  const styles = mergeStyleSets({
    "sales-person-note": {
      width: "100%",
      display: vm.displaySalesPerson,
    },
    description: {
      display: vm.EquipmentLine,
      width: "100%",
    },
    "text-field": {
      margin: "1%",
      border: "1px solid #eeeeee",
    },
    "text-field-label": {
      margin: "1%",
      marginBottom: "0",
    },
  });

  console.log(vm.currentNode);
  // console.log(vm.currentNode.name);

  return (
    <>
      <h1>
        {vm.currentNode.name ? vm.currentNode.name : "no name (to be fixed)"}
      </h1>
      <div className={styles["sales-person-note"]}>
        <Label
          className={styles["text-field-label"]}
          htmlFor={vm.currentNode.id}
        >
          Sales Person Notes
        </Label>
        <TextField
          id={vm.currentNode.id}
          underlined
          className={styles["text-field"]}
          multiline
          autoAdjustHeight
          onBlur={() => vm.onSalesPersonNotesBlurredHandler(vm.currentNode)}
          onChange={(
            e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => vm.onSalesPersonNotesChangedHandler(e)}
          value={vm.SalesPersonNote}
        />
      </div>
      <div className={styles.description}>
        <Label
          className={styles["text-field-label"]}
          htmlFor={vm.currentNode.id + 1000}
        >
          Description
        </Label>
        <TextField
          id={vm.currentNode.id + 1000}
          className={styles["text-field"]}
          underlined
          autoAdjustHeight
          multiline
          value={vm.ComputedDesc}
          readOnly={true}
        />
      </div>
    </>
  );
};

// export default observer(QuoteDetails);
