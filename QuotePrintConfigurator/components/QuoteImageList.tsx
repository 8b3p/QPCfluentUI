import { mergeStyleSets } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import React = require("react");
import { useServiceProvider } from "./context";
import QuoteImage from "./QuoteImage";

interface props {}

const QuoteImageList = (props: props) => {
  const vm = useServiceProvider();

  const styles = mergeStyleSets({
    "image-list": {
      display: vm.displaySalesPerson,
    },
    "css-row": {
      marginBottom: "5%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
  });

  const renderImages = (NofImages: number, from: number) => {
    let ImageList: JSX.Element[] = [];
    for (let i = 0; i < NofImages; i++) {
      ImageList.push(<QuoteImage key={from} ImageNumber={from} />);
      from++;
    }
    return ImageList;
  };

  return (
    <div className={styles["image-list"]}>
      <div className={styles["css-row"]}>{renderImages(2, 0)}</div>
      <div className={styles["css-row"]}>{renderImages(2, 2)}</div>
    </div>
  );
};

export default observer(QuoteImageList);
