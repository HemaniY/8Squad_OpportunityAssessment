import { LightningElement,wire,track } from 'lwc';
import { getObjectInfo} from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Opportunity from '@salesforce/schema/Opportunity';

export default class Assesment extends LightningElement {
  fields1=[];
  // fields2=[];
  // fields3=[];
  // fields4=[];
@track error;
    @wire (getObjectInfo,{objectApiName:Opportunity}) opportunityInfo({error,data})
    {
       
      if(data){
            this.fields1=[
                data.fields.Customer_Application_or_Project__c.label, data.fields.Customers_Business_Profile__c.label,
                data.fields.Customers_Financial_Condition__c.label, data.fields.Access_to_Fund__c.label,data.fields.Compelling_Event__c.label
            ]
            // fields2=[
            //   data.fields.Formal_Decision_Criteria.label, data.fields.Solution_Fit.label,
            //   data.fields.Sales_Resource_Requirement.label, data.fields.Current_Relationship.label,
            //   data.fields.Unique_Business_Value.label
            // ]  
            // fields3=[
            //   data.fields.Inside_Support.label, data.fields.Executive_Credibility.label,
            //   data.fields.Cultural_Fit.label,data.fields.Informal_Decision_Criteria.label, 
            //   data.fields.Political_Alignment.label
            // ]



       } else if(error){
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading opportunity',
                    message,
                    variant: 'error',
                }),
            );
        }
        
        }

      }
//recordinfo= opportunityInfo.data.defaultRecordTypeId;


  //  @wire(getPicklistValues,{fieldaApiName:'Customer_Application_or_Project__c',RecordTypeId: recordinfo}) pickOpp;


    // get getField(){
    //     fieldName = this.opportunityInfo.data.fields.Customer_Application_or_Project__c.label;
    //     return fieldName;
    //  }
    
    

    
    
    