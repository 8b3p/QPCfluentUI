import { makeAutoObservable } from "mobx";
import { ControlContextService, ServiceProvider } from "pcf-react";
import { RenderTree } from "../Functions/RenderTree";
import { IInputs } from "../generated/ManifestTypes";

export default class QPCcontrolVM {
  constructor(
    serviceProvider: ServiceProvider,
    context: ComponentFramework.Context<IInputs>
  ) {
    this.pcfContext = context;
    this.serviceProvider = serviceProvider;
    this.controlContext = serviceProvider.get<ControlContextService>(
      ControlContextService.serviceProviderName
    );
    this.updateData();
    makeAutoObservable(this, {
      serviceProvider: false,
      controlContext: false,
    });
  }
  serviceProvider = {} as ServiceProvider;
  controlContext = {} as ControlContextService;
  treeExpansionState = new Map<string, boolean>();
  firstLoad = true;
  private _currentNode: string = "";
  public get currentNode() {
    const value = this.getCurrentNode(this.items);
    return value ? value : ({} as RenderTree);
  }
  public set currentNode(value: RenderTree) {
    this._currentNode = value.Guid;
  }
  pcfContext = {} as ComponentFramework.Context<IInputs>;
  isLoaded = false;
  isThereData = false;
  controlWidth: number | undefined = 0;
  controlHeight: number | undefined = 0;
  items = {} as RenderTree;
  SalesPersonNote = "";
  DisplayEquipmentLineDev = false;
  DisplayQuoteLineDev = false;
  public get displaySalesPerson() {
    return this.DisplayEquipmentLineDev || this.DisplayQuoteLineDev
      ? "block"
      : "None";
  }
  public get EquipmentLine() {
    return this.DisplayEquipmentLineDev ? "Block" : "None";
  }
  public get QuotedisplayType() {
    return this.DisplayQuoteLineDev ? "Block" : "None";
  }
  public get ComputedDesc() {
    return this.currentNode.desc
      ? this.currentNode.desc
          .split("<br/>")
          .join("\n")
          .replace(/(<([^>]+)>)/gi, " ")
      : "";
    // .replace(/<\/?[^]+(>|$)/g, "") //* This is the old expression, will leave here for reference
  }

  /**
   * A search functoin for the RenderTree object, finds the wanted node by id
   * @param items
   * @returns Nothing, sets the currentNode in the ViewModel
   */
  private getCurrentNode = (items: RenderTree): any => {
    try {
      if (items.Guid == this._currentNode) {
        return items;
      } else if (items.children) {
        for (let child of items.children) {
          let node = this.getCurrentNode(child);
          if (node !== null || undefined) return node;
        }
      }
      return null;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  /**
   * not quite sure, but it refactors the data provided to it, made by Tim.
   * @param objectArray
   * @param property
   * @returns
   */

  groupByHeader = (objectArray: any[], property: string) => {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];

      if (!acc[key]) {
        acc[key] = [];
      }

      // Add object to list for given key's value

      acc[key].push(obj);

      return acc;
    }, {});
  };

  searchNode = (Guid: string) => {
    return this.items.Guid === Guid
      ? this.items
      : this.items.children?.filter(CurNode => CurNode.Guid === Guid);
  };

  /**
   * a fetchXml query for fetching the required data for the PCF
   * @param QuoteID
   * @returns string
   */
  getFetchXml = (QuoteID: string): string => `?fetchXml=
      <fetch>
      <entity name="quote">
        <attribute name="name" />
        <attribute name="quotenumber" />
        <attribute name="quoteid" />
        <filter>
          <condition entityname="quotedetail" attribute="quoteid" operator="eq" value=" ${QuoteID} " />
        </filter>
        <link-entity name="quotedetail" from="quoteid" to="quoteid" link-type="inner" alias="QuoteDetail">
          <attribute name="crf08_equipmentbuilder" />
          <attribute name="quotedetailname" />
          <attribute name="quotedetailid" />
          <attribute name="crf08_notes" />
          <attribute name="crf08_printprice" />
          <attribute name="quoteid" />
          <attribute name="crf08_url" />
          <attribute name="crf08_url2" />
          <attribute name="crf08_url3" />
          <attribute name="crf08_url4" />
          <link-entity name="nmc_equipmentbuilder" from="nmc_equipmentbuilderid" to="crf08_equipmentbuilder" link-type="outer" alias="EquipmentBuilder">
            <link-entity name="nmc_equipmentbuilderline" from="nmc_equipbuilder" to="nmc_equipmentbuilderid" link-type="outer" alias="EquipmentBuilderLine">
              <attribute name="nmc_designerlines" />
              <attribute name="crf08_axnote" />
              <attribute name="crf08_includeddescription" />
              <attribute name="crf08_includedphotos" />
              <attribute name="crf08_includednote" />
              <attribute name="nmc_equipmentbuilderlineid" />
              <attribute name="crf08_salespersonnote" />
              <attribute name="crf08_printprice" />
              <attribute name="crf08_excludefromprint" />
              <attribute name="crf08_url1" />
              <attribute name="crf08_url2" />
              <attribute name="crf08_url3" />
              <attribute name="crf08_url4" />
            </link-entity>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;

  /**
   * a massive function that does a whole lot of refactoring and checking and updates the data in the ViewModel
   * @returns nothing, updates the data in the ViewModel
   */
  updateData = () => {
    this.pcfContext.webAPI
      .retrieveMultipleRecords(
        "quote",
        this.getFetchXml(Xrm.Page.data.entity.getId())
      )
      .then((result: any) => {
        let groupedQuote;
        try {
          groupedQuote = this.groupByHeader(result.entities, "name");
        } catch (err: any) {
          throw new Error(err);
        }
        let QuoteLineName = Object.keys(groupedQuote)[0];

        let treeArray: RenderTree = {
          id: "0",
          name: "No Quote Lines",
          desc: "",
          SalesPersonNote: "",
          Guid: "",
          EntityType: "",
          children: [],
          PhotoURL: ["", "", "", ""],
          RTPrintDescription: false,
          RTPrintPhotos: false,
          RTPrintNote: false,
          RTPrintPrice: false,
          RTExcludeFromPrint: false,
        };
        if (QuoteLineName !== undefined) {
          treeArray["name"] = QuoteLineName;
          let groupedbyHeader = this.groupByHeader(
            groupedQuote[QuoteLineName],
            "QuoteDetail.quotedetailid"
          );
          let QuoteLineID: string[] = Object.keys(groupedbyHeader);
          for (let i = 0; i < QuoteLineID.length; i++) {
            let Child = [];
            for (let j = 0; j < groupedbyHeader[QuoteLineID[i]].length; j++) {
              let currentChild = groupedbyHeader[QuoteLineID[i]][j];
              Child.push({
                id: (j + (i + 1) * 10).toString(),
                name: currentChild["EquipmentBuilderLine.nmc_designerlines"],
                desc:
                  currentChild["EquipmentBuilderLine.crf08_axnote"] == undefined
                    ? ""
                    : currentChild["EquipmentBuilderLine.crf08_axnote"],
                SalesPersonNote:
                  currentChild["EquipmentBuilderLine.crf08_salespersonnote"] ==
                  undefined
                    ? ""
                    : currentChild[
                        "EquipmentBuilderLine.crf08_salespersonnote"
                      ],
                Guid: currentChild[
                  "EquipmentBuilderLine.nmc_equipmentbuilderlineid"
                ],
                EntityType: "nmc_equipmentbuilderline",
                RTPrintDescription:
                  currentChild[
                    "EquipmentBuilderLine.crf08_includeddescription"
                  ],
                RTPrintPhotos:
                  currentChild["EquipmentBuilderLine.crf08_includedphotos"],
                RTPrintNote:
                  currentChild["EquipmentBuilderLine.crf08_includednote"],
                RTPrintPrice:
                  currentChild["EquipmentBuilderLine.crf08_printprice"],
                RTExcludeFromPrint:
                  currentChild["EquipmentBuilderLine.crf08_excludefromprint"],
                PhotoURL: [
                  currentChild["EquipmentBuilderLine.crf08_url1"] || "",
                  currentChild["EquipmentBuilderLine.crf08_url2"] || "",
                  currentChild["EquipmentBuilderLine.crf08_url3"] || "",
                  currentChild["EquipmentBuilderLine.crf08_url4"] || "",
                ],
              });
            }
            //crf08_salespersonnote
            treeArray.children?.push({
              id: (i + 1).toString(),
              name: groupedbyHeader[QuoteLineID[i]][0][
                "QuoteDetail.quotedetailname"
              ],
              children:
                groupedbyHeader[QuoteLineID[i]][0][
                  "QuoteDetail.crf08_equipmentbuilder"
                ] == undefined
                  ? undefined
                  : Child,
              desc: "",
              SalesPersonNote:
                groupedbyHeader[QuoteLineID[i]][0]["QuoteDetail.crf08_notes"] ==
                undefined
                  ? ""
                  : groupedbyHeader[QuoteLineID[i]][0][
                      "QuoteDetail.crf08_notes"
                    ],
              Guid: groupedbyHeader[QuoteLineID[i]][0][
                "QuoteDetail.quotedetailid"
              ],
              EntityType: "quotedetail",

              RTPrintDescription: false,
              RTPrintPhotos: false,
              RTPrintNote: false,
              RTPrintPrice:
                groupedbyHeader[QuoteLineID[i]][0][
                  "QuoteDetail.crf08_printprice"
                ],
              RTExcludeFromPrint: false,
              PhotoURL: [
                groupedbyHeader[QuoteLineID[i]][0]["QuoteDetail.crf08_url"] ||
                  "",
                groupedbyHeader[QuoteLineID[i]][0]["QuoteDetail.crf08_url2"] ||
                  "",
                groupedbyHeader[QuoteLineID[i]][0]["QuoteDetail.crf08_url3"] ||
                  "",
                groupedbyHeader[QuoteLineID[i]][0]["QuoteDetail.crf08_url4"] ||
                  "",
              ],
            });
          }
        }
        // ServiceProvider.onFetchData(true, QuotationID !== undefined, treeArray);

        this.items = treeArray;
        this.isLoaded = true;
        this.isThereData = QuoteLineName !== undefined;
        if (this.firstLoad) {
          this.currentNode = treeArray;
          this.firstLoad = false;
        }
      })
      .catch((err: any) => {
        throw new Error(err.message);
      });
  };

  /**
   * updates the data in the dataverse and the ViewModel
   * @param checkboxtype
   * @param node
   */
  onCheckBoxCheckedHandler = (checkboxtype: string, node: RenderTree) => {
    let currentCheck: boolean;
    if (node != null && node?.EntityType == "nmc_equipmentbuilderline") {
      if (checkboxtype == "Description") {
        currentCheck = !node.RTPrintDescription;

        this.pcfContext.webAPI
          .updateRecord(node.EntityType, node.Guid, {
            crf08_includeddescription: currentCheck,
          })
          .then(response => {
            node.RTPrintDescription = currentCheck;
            // this.currentNode = node;
            this.items = this.items;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }

      if (checkboxtype == "Photos") {
        currentCheck = !node.RTPrintPhotos;
        this.pcfContext.webAPI
          .updateRecord(node?.EntityType, node.Guid, {
            crf08_includedphotos: currentCheck,
          })
          .then(response => {
            node.RTPrintPhotos = currentCheck;
            this.items = this.items;
            // this.currentNode = node
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }

      if (checkboxtype == "Note") {
        currentCheck = !node.RTPrintNote;
        this.pcfContext.webAPI
          .updateRecord(node?.EntityType, node.Guid, {
            crf08_includednote: currentCheck,
          })
          .then(response => {
            node.RTPrintNote = currentCheck;
            // this.currentNode = node;
            this.items = this.items;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }

      if (checkboxtype == "Price") {
        currentCheck = !node.RTPrintPrice;
        this.pcfContext.webAPI
          .updateRecord(node?.EntityType, node.Guid, {
            crf08_printprice: currentCheck,
          })
          .then(response => {
            node.RTPrintPrice = currentCheck;
            // this.currentNode = node;
            this.items = this.items;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
      if (checkboxtype == "ExcludeFromPrint") {
        currentCheck = !node.RTExcludeFromPrint;
        this.pcfContext.webAPI
          .updateRecord(node?.EntityType, node.Guid, {
            crf08_excludefromprint: currentCheck,
          })
          .then(response => {
            node.RTExcludeFromPrint = currentCheck;
            // this.currentNode = node;
            this.items = this.items;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    }

    if (node != null && node.EntityType == "quotedetail") {
      if (checkboxtype == "Price") {
        currentCheck = !node.RTPrintPrice;

        this.pcfContext.webAPI
          .updateRecord(node?.EntityType, node.Guid, {
            crf08_printprice: currentCheck,
          })
          .then(() => {
            node.RTPrintPrice = currentCheck;
            // this.currentNode = node;
            this.items = this.items;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    }
  };

  /**
   * changes the currendNode in the view model to the node clicked in the tree
   * @param node the node clicked
   */
  onTreeItemClickedHandler = (node: RenderTree) => {
    this.currentNode = node;
    this.SalesPersonNote = node.SalesPersonNote;
    this.DisplayEquipmentLineDev =
      node.EntityType == "nmc_equipmentbuilderline";
    this.DisplayQuoteLineDev = node.EntityType == "quotedetail";
  };

  /**
   * updates the salesPersonNote in the dataverse and the salesPersonNote in the node itself
   * @param node
   */
  onSalesPersonNotesBlurredHandler = async (node: RenderTree) => {
    let salesPersonNote = this.SalesPersonNote;
    if (
      node != null &&
      (node.EntityType == "nmc_equipmentbuilderline" ||
        node.EntityType == "quotedetail")
    ) {
      let key =
        node.EntityType == "nmc_equipmentbuilderline"
          ? "crf08_salespersonnote"
          : "crf08_notes";
      try {
        await this.pcfContext.webAPI.updateRecord(node.EntityType, node.Guid, {
          [key]: salesPersonNote,
        });
        node.SalesPersonNote = salesPersonNote;
        this.items = this.items;
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  };

  /**
   * updates the "salesPersonNote" in the ViewModel on each key stroke
   * @param event
   */
  onSalesPersonNotesChangedHandler = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.SalesPersonNote = event.currentTarget.value;
  };

  /**
   * updates the imageUrl in the dataverse and the ViewModel on each key stroke
   * @param imageUrl
   * @param ImageNumber
   */
  imageUrlChangeHandler = async (imageUrl: string, ImageNumber: number) => {
    let node = this.currentNode;
    // let oldNode = this.currentNode;

    if (
      node != null &&
      (node.EntityType == "nmc_equipmentbuilderline" ||
        node.EntityType == "quotedetail")
    ) {
      let key = "";

      let CurrentUrl = "";
      key =
        node.EntityType == "nmc_equipmentbuilderline"
          ? `crf08_url${ImageNumber + 1}`
          : ImageNumber === 0
          ? "crf08_url"
          : `crf08_url${ImageNumber + 1}`;

      CurrentUrl = imageUrl;
      node.PhotoURL[ImageNumber] = CurrentUrl;
      this.currentNode = node;

      try {
        let result = await this.pcfContext.webAPI.updateRecord(
          node.EntityType,
          node.Guid,
          {
            [key]: imageUrl,
          }
        );
      } catch (err: any) {
        // this.currentNode = oldNode;
        throw new Error(err.message);
      }
    }
  };
}

export const serviceProviderName = "ViewModel" as string;
