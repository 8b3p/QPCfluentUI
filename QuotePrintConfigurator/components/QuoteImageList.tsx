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
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    box: {
      minWidth: "300px",
      display: "flex",
      justifyContent: "center",
      flex: "1 1 50%",
    },
  });

  const renderNumberOfImages = (NofImages: number, from: number) => {
    let ImageList: JSX.Element[] = [];
    for (let i = 0; i < NofImages; i++) {
      ImageList.push(<QuoteImage key={from} ImageNumber={from} />);
      from++;
    }
    return ImageList;
  };
  const renderImages = (NofImages: number) => {
    let ImageList: JSX.Element[] = [];
    let from = 0;
    while (NofImages > 0) {
      if (NofImages > 2) {
        ImageList.push(
          <div key={from} className={styles["box"]}>
            {renderNumberOfImages(2, from)}
          </div>
        );
        NofImages -= 2;
        from += 2;
      } else {
        ImageList.push(
          <div key={from} className={styles["box"]}>
            {renderNumberOfImages(NofImages, from)}
          </div>
        );
        NofImages = 0;
      }
    }
    return ImageList;
  };

  return (
    <div className={styles["image-list"]}>
      <div className={styles["css-row"]}>{renderImages(4)}</div>
    </div>
  );
};

export default observer(QuoteImageList);
