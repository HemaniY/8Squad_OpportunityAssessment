//import { getRecord} from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Opportunityy from '@salesforce/schema/Opportunity';
import { LightningElement, wire } from 'lwc';

// const FIELDS = [
//     'Opportunity.Customer_Application_or_Project__c',
//     'Opportunity.Customers_Business_Profile__c',
//     'Opportunity.Customer_s_Finanacial_Condition__c',
//     'Opportunity.Access_To_Fund__c',
//     'Opportunity.Compelling_Event__c',
//     'Opportunity.Formal_Decision_Criteria__c',
//     'Opportunity.Solution_Fit__c',
//     'Opportunity.Sales_resources_Requirements__c',
//     'Opportunity.Current_relationship__c',
//     'Opportunity.Unique_business_Value__c',
//     'Opportunity.Inside_Support__c',
//     'Opportunity.Executive_Credibility__c',
//     'Opportunity.Cultural_Fit__c',
//     'Opportunity.Informal_Decision_Criteria__c',
//     'Opportunity.Political_Alignment__c',
//     'Opportunity.Short_Term_Revenue__c',
//     'Opportunity.Future_Revenue__c',
//     'Opportunity.Profitability__c',
//     'Opportunity.Degree_Of_Risk__c',
//     'Opportunity.Strategic_Value__c',
// ];
export default class Table1 extends LightningElement {
 
    // getting a record with the fields specified in Opportunity
//  @api recordId;
// @wire (getRecord,{recordiD:'$recordId',FIELDS}) Opportunity;
// get custApp(){
//     return this.Opportunity.data.fields.customer_Application_or_Project__c;
    
// }
// get customerBusiness(){
//     return this.Opportunity.data.fields.Customers_Business_Profile__c;
// }
//  getting object information(metadata) like 

// getInformation({data,error})
// {
//     if(data){

//     }
//     const rtis= this.getInformation.data.fields;
//     console.log(this.getInformation.data);
// }


@wire(getObjectInfo,{objectApiName:Opportunityy}) oppInfo;
get objMeta(){
    //return this.oppInfo? JSON.stringify(this.oppInfo.data.fields.Compelling_Event__c.label):'';
    return this.oppInfo.data.fields.CompellingEvent.label;
  }

}