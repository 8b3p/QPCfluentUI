// import QPCcontrolVM from "../ViewModels/QPCcontrolVM";
// import { RenderTree } from "./RenderTree";

// type returned = {
//   isLoaded: boolean;
//   dataIsPresent: boolean;
//   items: RenderTree;
// };

// export const fetchData = (webAPI: ComponentFramework.WebApi): returned => {
//   //this.props.pcfContext.updatedProperties.values
//   webAPI
//     .retrieveMultipleRecords("quote", getFetchXml(Xrm.Page.data.entity.getId()))
//     .then((result: any) => {
//       let groupedQuote = groupBy(result.entities, "name");

//       let QuotationID = Object.keys(groupedQuote)[0];

//       let treeArray: RenderTree = {
//         id: "0",
//         name: "No Quote Lines",
//         desc: "",
//         SalesPersonNote: "",
//         Guid: "",
//         EntityType: "",
//         children: [],
//         PhotoURL: ["", "", "", ""],
//         RTPrintDescription: false,
//         RTPrintPhotos: false,
//         RTPrintNote: false,
//         RTPrintPrice: false,
//         RTExcludeFromPrint: false,
//       };
//       if (QuotationID !== undefined) {
//         treeArray["name"] = QuotationID;
//         let groupedbyHeader = groupBy(
//           groupedQuote[QuotationID],
//           "QuoteDetail.quotedetailid"
//         );

//         let gbHeader: string[] = Object.keys(groupedbyHeader);
//         for (let i = 0; i < gbHeader.length; i++) {
//           let Child = [];
//           for (let j = 0; j < groupedbyHeader[gbHeader[i]].length; j++) {
//             let currentChild = groupedbyHeader[gbHeader[i]][j];
//             Child.push({
//               id: (j + (i + 1) * 10).toString(),
//               name: currentChild["EquipmentBuilderLine.nmc_designerlines"],
//               desc:
//                 currentChild["EquipmentBuilderLine.crf08_axnote"] == undefined
//                   ? ""
//                   : currentChild["EquipmentBuilderLine.crf08_axnote"],
//               SalesPersonNote:
//                 currentChild["EquipmentBuilderLine.crf08_salespersonnote"] ==
//                 undefined
//                   ? ""
//                   : currentChild["EquipmentBuilderLine.crf08_salespersonnote"],
//               Guid: currentChild[
//                 "EquipmentBuilderLine.nmc_equipmentbuilderlineid"
//               ],
//               EntityType: "nmc_equipmentbuilderline",
//               RTPrintDescription:
//                 currentChild["EquipmentBuilderLine.crf08_includeddescription"],
//               RTPrintPhotos:
//                 currentChild["EquipmentBuilderLine.crf08_includedphotos"],
//               RTPrintNote:
//                 currentChild["EquipmentBuilderLine.crf08_includednote"],
//               RTPrintPrice:
//                 currentChild["EquipmentBuilderLine.crf08_printprice"],
//               RTExcludeFromPrint:
//                 currentChild["EquipmentBuilderLine.crf08_excludefromprint"],
//               PhotoURL: [
//                 currentChild["EquipmentBuilderLine.crf08_url1"],
//                 currentChild["EquipmentBuilderLine.crf08_url2"],
//                 currentChild["EquipmentBuilderLine.crf08_url3"],
//                 currentChild["EquipmentBuilderLine.crf08_url4"],
//               ],
//             });
//           }
//           //crf08_salespersonnote
//           treeArray.children?.push({
//             id: (i + 1).toString(),
//             name: groupedbyHeader[gbHeader[i]][0][
//               "QuoteDetail.quotedetailname"
//             ],
//             children:
//               groupedbyHeader[gbHeader[i]][0][
//                 "QuoteDetail.crf08_equipmentbuilder"
//               ] == undefined
//                 ? undefined
//                 : Child,
//             desc: "",
//             SalesPersonNote:
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_notes"] ==
//               undefined
//                 ? ""
//                 : groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_notes"],
//             Guid: groupedbyHeader[gbHeader[i]][0]["QuoteDetail.quotedetailid"],
//             EntityType: "quotedetail",

//             RTPrintDescription: false,
//             RTPrintPhotos: false,
//             RTPrintNote: false,
//             RTPrintPrice:
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_printprice"],
//             RTExcludeFromPrint: false,
//             PhotoURL: [
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url"],
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url2"],
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url3"],
//               groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url4"],
//             ],
//           });
//         }
//       }
//       // ServiceProvider.onFetchData(true, QuotationID !== undefined, treeArray);

//       return { isLoaded: true, dataIsPresent: true, items: DummyTreeData };

//       //
//       // perform additional operations on retrieved records
//     })
//     .catch((err: any) => {
//       throw new Error(err.message);
//     });
//   throw new Error("idfk");
// };

// const groupBy = (objectArray: any[], property: any) => {
//   return objectArray.reduce((acc, obj) => {
//     const key = obj[property];

//     if (!acc[key]) {
//       acc[key] = [];
//     }

//     // Add object to list for given key's value

//     acc[key].push(obj);

//     return acc;
//   }, {});
// };
// const getFetchXml = (QuoteIdValue: string) => {
//   return `?fetchXml=
//         <fetch>
//         <entity name="quote">
//           <attribute name="name" />
//           <attribute name="quotenumber" />
//           <attribute name="quoteid" />
//           <filter>
//             <condition entityname="quotedetail" attribute="quoteid" operator="eq" value=" ${QuoteIdValue} " />
//           </filter>
//           <link-entity name="quotedetail" from="quoteid" to="quoteid" link-type="inner" alias="QuoteDetail">
//             <attribute name="crf08_equipmentbuilder" />
//             <attribute name="quotedetailname" />
//             <attribute name="quotedetailid" />
//             <attribute name="crf08_notes" />
//             <attribute name="crf08_printprice" />
//             <attribute name="quoteid" />
//             <attribute name="crf08_url" />
//             <attribute name="crf08_url2" />
//             <attribute name="crf08_url3" />
//             <attribute name="crf08_url4" />
//             <link-entity name="nmc_equipmentbuilder" from="nmc_equipmentbuilderid" to="crf08_equipmentbuilder" link-type="outer" alias="EquipmentBuilder">
//               <link-entity name="nmc_equipmentbuilderline" from="nmc_equipbuilder" to="nmc_equipmentbuilderid" link-type="outer" alias="EquipmentBuilderLine">
//                 <attribute name="nmc_designerlines" />
//                 <attribute name="crf08_axnote" />
//                 <attribute name="crf08_includeddescription" />
//                 <attribute name="crf08_includedphotos" />
//                 <attribute name="crf08_includednote" />
//                 <attribute name="nmc_equipmentbuilderlineid" />
//                 <attribute name="crf08_salespersonnote" />
//                 <attribute name="crf08_printprice" />
//                 <attribute name="crf08_excludefromprint" />
//                 <attribute name="crf08_url1" />
//                 <attribute name="crf08_url2" />
//                 <attribute name="crf08_url3" />
//                 <attribute name="crf08_url4" />
//               </link-entity>
//             </link-entity>
//           </link-entity>
//         </entity>
//       </fetch>`;
// };
