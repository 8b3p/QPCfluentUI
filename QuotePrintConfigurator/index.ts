import { StandardControlReact } from "pcf-react";
import React = require("react");
import ReactDOM = require("react-dom");
import App, { props } from "./components/App";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import QPCcontrolVM, { serviceProviderName } from "./ViewModels/QPCcontrolVM";

export class QuotePrintConfigurator extends StandardControlReact<
  IInputs,
  IOutputs
> {
  constructor() {
    super();
    console.log("constructor starts");
    this.renderOnParametersChanged = false;
    this.initServiceProvider = serviceProvider => {
      serviceProvider.register(
        serviceProviderName,
        new QPCcontrolVM(serviceProvider, this.context)
      );
    };
    this.reactCreateElement = (container, width, height, serviceProvider) => {
      ReactDOM.render(
        React.createElement<props>(App, {
          serviceProvider: serviceProvider,
          controlWidth: width,
          controlHeight: container.clientHeight,
        }),
        container
      );
    };
  }
}
