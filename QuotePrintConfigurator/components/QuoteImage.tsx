import { mergeStyleSets, TextField } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import React = require("react");
import { useServiceProvider } from "./context";

interface props {
  ImageNumber: number;
}

const QuoteImage = (props: props) => {
  const vm = useServiceProvider();
  const [imageUrl, setImageUrl] = useState("");
  const [urlIsValid, setUrlIsValid] = useState(false);

  useEffect(() => {
    setUrlIsValid(false);
    setImageUrl(
      vm.currentNode.PhotoURL ? vm.currentNode.PhotoURL[props.ImageNumber] : ""
    );
    checkUrlValidity(
      vm.currentNode.PhotoURL ? vm.currentNode.PhotoURL[props.ImageNumber] : ""
    );
  }, [vm.currentNode]);

  const styles = mergeStyleSets({
    "css-column": {
      margin: "1%",
      width: "50%",
    },
    "css-url-save-button": {
      position: "relative",
    },
    Card: {
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
      padding: "5%",
      textAlign: "center",
      backgroundColor: "#f1f1f1",
      width: "90%",
    },
    "css-image-style": {
      width: "100%",
      height: "95%",
    },
    "text-field": {
      border: "1px solid #eeeeee",
      magrin: "1%",
      // width: "97%",
    },
  });

  const imageUrlChangeHandler = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setImageUrl(e.currentTarget.value);
    checkUrlValidity(e.currentTarget.value);
    vm.imageUrlChangeHandler(e.currentTarget.value, props.ImageNumber);
  };

  const checkUrlValidity = async (url: string) => {
    var img = new Image();
    img.src = url;
    img.onload = (e: Event) => {
      setUrlIsValid(true);
    };
    img.onerror = (e: Event | string) => {
      setUrlIsValid(false);
    };
  };

  return (
    <div className={styles["css-column"]}>
      <div className={styles["css-url-save-button"]}>
        <TextField
          className={styles["text-field"]}
          underlined
          onChange={imageUrlChangeHandler}
          placeholder='Image URL'
          value={imageUrl}
        />
      </div>
      {urlIsValid && (
        <div className={styles["Card"]}>
          <img
            src={
              vm.currentNode.PhotoURL
                ? vm.currentNode.PhotoURL[props.ImageNumber]
                : ""
            }
            onError={({ currentTarget }) => {
              setUrlIsValid(false);
              currentTarget.onerror = null; // prevents looping
            }}
            className={styles["css-image-style"]}
          />
        </div>
      )}
    </div>
  );
};

export default observer(QuoteImage);
