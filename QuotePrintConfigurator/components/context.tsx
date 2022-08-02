import React = require("react");
import QPCcontrolVM from "../ViewModels/QPCcontrolVM";

export const serviceProviderContext = React.createContext<QPCcontrolVM>(
  {} as QPCcontrolVM
);

export interface props {
  value: QPCcontrolVM;
  children: JSX.Element;
}

const ContextProvider = (props: props) => {
  return (
    <serviceProviderContext.Provider value={props.value}>
      {props.children}
    </serviceProviderContext.Provider>
  );
};

export const useServiceProvider = () =>
  React.useContext(serviceProviderContext);

export default ContextProvider;
