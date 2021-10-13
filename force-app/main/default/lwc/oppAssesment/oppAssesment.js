import { LightningElement, wire, api, track } from "lwc";
import {
  getObjectInfo,
  getPicklistValuesByRecordType
} from "lightning/uiObjectInfoApi";
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import Opportunity from "@salesforce/schema/Opportunity";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const allFields = [
  "Opportunity.Customer_Application_or_Project__c",
  "Opportunity.Customers_Business_Profile__c",
  "Opportunity.Customers_Financial_Condition__c",
  "Opportunity.Access_to_Fund__c",
  "Opportunity.Compelling_Event__c",
  "Opportunity.Formal_Decision_Criteria__c",
  "Opportunity.Solution_Fit__c",
  "Opportunity.Sales_Resource_Requirement__c",
  "Opportunity.Current_Relationship__c",
  "Opportunity.Unique_Business_Value__c",
  "Opportunity.Inside_Support__c",
  "Opportunity.Executive_Credibility__c",
  "Opportunity.Cultural_Fit__c",
  "Opportunity.Informal_Decision_Criteria__c",
  "Opportunity.Political_Alignment__c",
  "Opportunity.Short_Term_Revenue__c",
  "Opportunity.Future_Revenue__c",
  "Opportunity.Profitability__c",
  "Opportunity.Degree_of_Risk__c",
  "Opportunity.Strategic_Value__c"
];

const fieldNameApi1 = [
  "Opportunity.Customer_Application_or_Project__c",
  "Opportunity.Customers_Business_Profile__c",
  "Opportunity.Customers_Financial_Condition__c",
  "Opportunity.Access_to_Fund__c",
  "Opportunity.Compelling_Event__c"
];

const fieldNameApi2 = [
  "Opportunity.Formal_Decision_Criteria__c",
  "Opportunity.Solution_Fit__c",
  "Opportunity.Sales_Resource_Requirement__c",
  "Opportunity.Current_Relationship__c",
  "Opportunity.Unique_Business_Value__c"
];

const fieldNameApi3 = [
  "Opportunity.Inside_Support__c",
  "Opportunity.Executive_Credibility__c",
  "Opportunity.Cultural_Fit__c",
  "Opportunity.Informal_Decision_Criteria__c",
  "Opportunity.Political_Alignment__c"
];

const fieldNameApi4 = [
  "Opportunity.Short_Term_Revenue__c",
  "Opportunity.Future_Revenue__c",
  "Opportunity.Profitability__c",
  "Opportunity.Degree_of_Risk__c",
  "Opportunity.Strategic_Value__c"
];

export default class OppAssesment extends LightningElement {
  @track table1 = [];
  @track table2 = [];
  @track table3 = [];
  @track table4 = [];
  sCount = 0;
  optionsForField = [];

  @api recordId;
  getRecordId;

  oppInfoData;
  oppRecordData;
  error;

  labelColor = "";

  @wire(getObjectInfo, { objectApiName: Opportunity }) opportunityInfo({
    error,
    data
  }) {
    if (data) {
      this.oppInfoData = data;
    } else if (error) {
      this.handleError(error);
    }
  }

  @wire(getRecord, { recordId: "$recordId", fields: allFields }) recordWired({
    error,
    data
  }) {
    if (data) {
      this.oppRecordData = data;
      this.getRecordId = data.recordTypeId;
    } else if (error) {
      this.handleError(error);
    }
  }

  @wire(getPicklistValuesByRecordType, {
    objectApiName: Opportunity,
    recordTypeId: "$getRecordId"
  })
  picklistsValue({ error, data }) {
    if (data) {
      console.log(data.picklistFieldValues);
      this.optionsForField = this.pickFieldValue(data.picklistFieldValues);
      console.log(this.optionsForField);
      this.table1 = this.tableData(this.oppInfoData, fieldNameApi1);
      this.table2 = this.tableData(this.oppInfoData, fieldNameApi2);
      this.table3 = this.tableData(this.oppInfoData, fieldNameApi3);
      this.table4 = this.tableData(this.oppInfoData, fieldNameApi4);
    } else if (error) {
      this.handleError(error);
    }
  }
  // Getting fields with their picklist values

  pickFieldValue(picklistValues) {
    const pickfield = [];

    Object.keys(picklistValues).forEach((picklist) => {
      pickfield.push({
        label: picklist,
        items: picklistValues[picklist].values
      });
    });
    return pickfield;
  }

  tableData(data1, fieldApi) {
    let fieldName;
    let data = [];
    let isChecked = false;
    let fieldValueOptions = [];
    let Currentval;
    let fieldN;

    // eslint-disable-next-line guard-for-in
    for (let k in fieldApi) {
      fieldN = fieldApi[k].replace("Opportunity.", "");

      // Getting the fields value
      Currentval = this.oppRecordData.fields[fieldN].value;

      // eslint-disable-next-line no-loop-func
      this.optionsForField.forEach((element) => {
        // finding the field
        if (fieldN === element.label) {
          // For each field assignig the 3 values
          fieldValueOptions = element.items;
          let option = [];

          fieldValueOptions.forEach((el) => {
            // let labelColor="";

            if (Currentval === el.value) {
              isChecked = true;
            } else {
              isChecked = false;
            }

            // Assigning the label color according to the value
            if (isChecked === true) {
              this.labelColor = this.colors(el.label);
              option.push({
                color: this.labelColor,
                FieldApiName: fieldN,
                option: el.label,
                checked: isChecked
              });
            } else {
              option.push({
                color: "default",
                FieldApiName: fieldN,
                option: el.label,
                checked: isChecked
              });
            }
          });

          fieldName = data1.fields[fieldN].label;
          this.sCount = this.sCount + 1;

          // contains the field label, 3 options,colour for checked option
          data.push({
            FieldApiName: fieldN,
            SNO: this.sCount,
            Field: fieldName,
            Option: option
          });
        }
      });
    }

    return data;
  }

  Selected(event) {
    const fields = {};
    const datetime = new Date();

    var ApiFieldName = event.target.name;
    fields[ApiFieldName] = event.target.value;

    fields.Id = this.recordId;
    fields.TAS_Last_Modified_Date__c = datetime.toISOString();

    const recordInput = { fields };

    //  updateRecords(fields).then(()=>{
    //      console.log('Updated');
    //  }
    //  )
    updateRecord(recordInput)
      .then(() => {
        // new CustomEvent('recordchange')
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Opportunity updated",
            variant: "success"
          })
        );
      })

      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });

    this.table1.forEach((element) => {
      if (element.FieldApiName === event.target.name) {
        this.changeColorOnClick(element.Option, event);
      }
    });

    this.table2.forEach((element) => {
      if (element.FieldApiName === event.target.name) {
        this.changeColorOnClick(element.Option, event);
      }
    });

    this.table3.forEach((element) => {
      if (element.FieldApiName === event.target.name) {
        this.changeColorOnClick(element.Option, event);
      }
    });

    this.table4.forEach((element) => {
      if (element.FieldApiName === event.target.name) {
        this.changeColorOnClick(element.Option, event);
      }
    });
  }

  colors(color) {
    if (
      color === "Defined" ||
      color === "Strong" ||
      color === "Yes" ||
      color === "High" ||
      color === "Good"
    ) {
      return "green";
    } else if (
      color === "Not Defined" ||
      color === "Weak" ||
      color === "Low" ||
      color === "Poor" ||
      color === "No"
    ) {
      return "red";
    } else if (color === "Unsure") {
      // this.template.querySelector('[data-field="fieldoption"]').class="yellow";
      return "yellow";
    }
    return "";
  }

  changeColorOnClick(option, event) {
    option.forEach((element1) => {
      // console.log(element1.option);
      element1.color = "default";
      element1.checked = false;
      if (element1.option === event.target.value) {
        // console.log(element1.color);
        console.log(element1.checked);
        element1.checked = event.target.checked;
        element1.color = this.colors(event.target.value);
        //  element1.checked = event.target.checked;
        console.log(element1.color);
        console.log(element1.checked);
      }
    });
  }

  handleError(error) {
    this.error = "Unknown error";
    if (Array.isArray(error.body)) {
      this.error = error.body.map((e) => e.message).join(", ");
    } else if (typeof error.body.message === "string") {
      this.error = error.body.message;
    }
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error loading opportunity",
        variant: "error"
      })
    );
  }
}
