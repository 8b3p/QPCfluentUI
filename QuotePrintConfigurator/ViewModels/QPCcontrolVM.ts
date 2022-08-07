import { makeAutoObservable } from "mobx";
import { ControlContextService, ServiceProvider } from "pcf-react";
import { RenderTree } from "../Functions/RenderTree";
import { IInputs } from "../generated/ManifestTypes";

export default class QPCcontrolVM {
  serviceProvider = {} as ServiceProvider;
  controlContext = {} as ControlContextService;
  firstLoad = true;
  private _currentNode: string = "";
  checkboxLoading = false;
  public get currentNode() {
    const value = this.getCurrentNode(this.items);
    return value ? value : ({} as RenderTree);
  }
  public set currentNode(value) {
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
  ImageURL = ["", "", "", ""];
  private _displaySalesPerson = false;
  public get displaySalesPerson() {
    return this.DisplayEquipmentLineDev || this.DisplayQuoteLineDev
      ? "block"
      : "None";
  }
  private _EquipmentLine = false;
  public get EquipmentLine() {
    return this.DisplayEquipmentLineDev ? "Block" : "None";
  }
  private _QuotedisplayType = false;
  public get QuotedisplayType() {
    return this.DisplayQuoteLineDev ? "Block" : "None";
  }
  private _ComputedDesc = "";
  public get ComputedDesc() {
    return this.currentNode.desc
      ? this.currentNode.desc
          .replace("<br/>", "\n")
          .replace(/<\/?[^]+(>|$)/g, "")
      : "";
  }

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

  groupByHeader = (objectArray: any[], property: any) => {
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

  getFetchXml = (QuoteIdValue: string) => {
    return `?fetchXml=
      <fetch>
      <entity name="quote">
        <attribute name="name" />
        <attribute name="quotenumber" />
        <attribute name="quoteid" />
        <filter>
          <condition entityname="quotedetail" attribute="quoteid" operator="eq" value=" ${QuoteIdValue} " />
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
  };

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
        let QuotationID = Object.keys(groupedQuote)[0];

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
        if (QuotationID !== undefined) {
          treeArray["name"] = QuotationID;
          let groupedbyHeader = this.groupByHeader(
            groupedQuote[QuotationID],
            "QuoteDetail.quotedetailid"
          );

          let gbHeader: string[] = Object.keys(groupedbyHeader);
          for (let i = 0; i < gbHeader.length; i++) {
            let Child = [];
            for (let j = 0; j < groupedbyHeader[gbHeader[i]].length; j++) {
              let currentChild = groupedbyHeader[gbHeader[i]][j];
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
              name: groupedbyHeader[gbHeader[i]][0][
                "QuoteDetail.quotedetailname"
              ],
              children:
                groupedbyHeader[gbHeader[i]][0][
                  "QuoteDetail.crf08_equipmentbuilder"
                ] == undefined
                  ? undefined
                  : Child,
              desc: "",
              SalesPersonNote:
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_notes"] ==
                undefined
                  ? ""
                  : groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_notes"],
              Guid: groupedbyHeader[gbHeader[i]][0][
                "QuoteDetail.quotedetailid"
              ],
              EntityType: "quotedetail",

              RTPrintDescription: false,
              RTPrintPhotos: false,
              RTPrintNote: false,
              RTPrintPrice:
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_printprice"],
              RTExcludeFromPrint: false,
              PhotoURL: [
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url"] || "",
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url2"] || "",
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url3"] || "",
                groupedbyHeader[gbHeader[i]][0]["QuoteDetail.crf08_url4"] || "",
              ],
            });
          }
        }
        // ServiceProvider.onFetchData(true, QuotationID !== undefined, treeArray);

        this.items = treeArray;
        this.isLoaded = true;
        this.isThereData = QuotationID !== undefined;
        if (this.firstLoad) {
          this.currentNode = treeArray;
          this.firstLoad = false;
        }
      })
      .catch((err: any) => {
        throw new Error(err.message);
      });
  };

  onCheckBoxCheckedHandler = (checkboxtype: string, node: RenderTree) => {
    let currentCheck: boolean;
    this.checkboxLoading = true;
    if (node != null && node?.EntityType == "nmc_equipmentbuilderline") {
      if (checkboxtype == "Description") {
        currentCheck = !node.RTPrintDescription;

        this.pcfContext.webAPI
          .updateRecord(node.EntityType, node.Guid, {
            crf08_includeddescription: currentCheck,
          })
          .then(response => {
            node.RTPrintDescription = currentCheck;
            this.currentNode = node;
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
            this.currentNode = node;
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
            this.currentNode = node;
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
            this.currentNode = node;
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
            this.currentNode = node;
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
            this.currentNode = node;
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    }
  };

  onTreeItemClickedHandler = (node: RenderTree) => {
    this.currentNode = node;
    this.SalesPersonNote = node.SalesPersonNote;
    this.ImageURL = node.PhotoURL;
    this.DisplayEquipmentLineDev =
      node.EntityType == "nmc_equipmentbuilderline";
    this.DisplayQuoteLineDev = node.EntityType == "quotedetail";
  };

  onSalesPersonNotesBlurredHandler = (node: RenderTree) => {
    if (
      node != null &&
      (node.EntityType == "nmc_equipmentbuilderline" ||
        node.EntityType == "quotedetail")
    ) {
      let key =
        node.EntityType == "nmc_equipmentbuilderline"
          ? "crf08_salespersonnote"
          : "crf08_notes";
      this.pcfContext.webAPI
        .updateRecord(node.EntityType, node.Guid, {
          [key]: this.SalesPersonNote,
        })
        .then(() => {
          node.SalesPersonNote = this.SalesPersonNote;
          this.items = this.items;
        })
        .catch(err => {
          throw new Error(err.message);
        });
    }
  };

  onSalesPersonNotesChangedHandler = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.SalesPersonNote = event.currentTarget.value;
  };

  imageUrlChangeHandler = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    ImageNumber: number
  ) => {
    this.ImageURL[ImageNumber] = event.currentTarget.value;
  };

  imageUrlBlurrHandler = async (ImageNumber: number) => {
    let node = this.currentNode;

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
          : "crf08_url";

      CurrentUrl = this.ImageURL[ImageNumber];
      try {
        await this.pcfContext.webAPI.updateRecord(node.EntityType, node.Guid, {
          [key]: this.ImageURL[ImageNumber],
        });
        node.PhotoURL[ImageNumber] = CurrentUrl;

        this.currentNode = node;
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  };
}

export const serviceProviderName = "ViewModel" as string;
