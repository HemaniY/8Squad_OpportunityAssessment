import { LightningElement, wire, api } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType} from 'lightning/uiObjectInfoApi';
import { getRecord, updateRecord} from 'lightning/uiRecordApi';
import Opportunity from '@salesforce/schema/Opportunity';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const allFields=['Opportunity.Customer_Application_or_Project__c','Opportunity.Customers_Business_Profile__c',
                'Opportunity.Customers_Financial_Condition__c','Opportunity.Access_to_Fund__c',
                'Opportunity.Compelling_Event__c','Opportunity.Formal_Decision_Criteria__c','Opportunity.Solution_Fit__c',
                'Opportunity.Sales_Resource_Requirement__c','Opportunity.Current_Relationship__c',
                'Opportunity.Unique_Business_Value__c','Opportunity.Inside_Support__c','Opportunity.Executive_Credibility__c',
                'Opportunity.Cultural_Fit__c','Opportunity.Informal_Decision_Criteria__c',
                'Opportunity.Political_Alignment__c', 'Opportunity.Short_Term_Revenue__c', 'Opportunity.Future_Revenue__c',
                'Opportunity.Profitability__c','Opportunity.Degree_of_Risk__c',
                'Opportunity.Strategic_Value__c']

const fieldNameApi1=['Opportunity.Customer_Application_or_Project__c','Opportunity.Customers_Business_Profile__c',
                    'Opportunity.Customers_Financial_Condition__c','Opportunity.Access_to_Fund__c',
                    'Opportunity.Compelling_Event__c'];

const fieldNameApi2=['Opportunity.Formal_Decision_Criteria__c','Opportunity.Solution_Fit__c',
                    'Opportunity.Sales_Resource_Requirement__c','Opportunity.Current_Relationship__c',
                    'Opportunity.Unique_Business_Value__c'];

const fieldNameApi3=['Opportunity.Inside_Support__c','Opportunity.Executive_Credibility__c',
                    'Opportunity.Cultural_Fit__c','Opportunity.Informal_Decision_Criteria__c',
                    'Opportunity.Political_Alignment__c'];

const fieldNameApi4= [
            'Opportunity.Short_Term_Revenue__c', 'Opportunity.Future_Revenue__c',
            'Opportunity.Profitability__c','Opportunity.Degree_of_Risk__c',
            'Opportunity.Strategic_Value__c'
        ]

    
export default class OppAssesment extends LightningElement {

            table=[];
            table2=[];
            table3=[];
            table4=[];
             sCount=0;

 
            optionsForField=[];

            @api recordId;
            oppInfoData;

            oppRecordData;
            getRecrecordId;
             error;
   
            @wire (getObjectInfo,{objectApiName:Opportunity}) opportunityInfo({error,data})
            {
         
            if(data){
                this.oppInfoData= data;

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
   
    
    @wire(getRecord,{recordId:'$recordId', fields:allFields})recordWired({error,data})
    {
        if(data){
          
            this.oppRecordData= data;
            
            this.getRecrecordId= data.recordTypeId;
            // console.log(this.getRecrecordId)
        
            
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
        @wire(getPicklistValuesByRecordType, { objectApiName: Opportunity, recordTypeId:'$getRecrecordId' })picklistsValue({error,data})
        {
            

        if(data){
           // console.log("2");
            this.optionsForField= this.fieldPick(data.picklistFieldValues); 
        
            this.table=this.tableData(this.oppInfoData,fieldNameApi1);
     
            this.table2= this.tableData(this.oppInfoData,fieldNameApi2);
            this.table3= this.tableData(this.oppInfoData,fieldNameApi3);
            this.table4=this.tableData(this.oppInfoData,fieldNameApi4);
         //   console.log( this.table4);
           
            
        }
        else if(error){
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

    fieldPick(picklistValues) {
        const pickfield = [];
    // let options=[];
        Object.keys(picklistValues).forEach((picklist) => {
            pickfield.push({
                label: picklist,
                items: picklistValues[picklist].values
            });
        });
        return pickfield;
        
    } 


            tableData(data1,fieldApi)
             {
                        
                        let fieldName;
                        var data=[];
                        let isChecked= false;
                         var op=[];
                        
                        for(let k in fieldApi)
                         {
                        
                           
                                // let Val = getFieldValue(this.oppRecordData,fieldApi[k]);
                                
                                let fieldN= fieldApi[k].replace('Opportunity.','');
                               // console.log(this.oppRecordData.fields[fieldN].value);
                                let Val = this.oppRecordData.fields[fieldN].value;
                                this.optionsForField.forEach(element => {
                                
                                if(fieldN== element.label)
                                    {      

                                        op= element.items;
                                    
                                        let option=[];
                                        op.forEach(el=>{
                                            let labelColor="";
                                            
                                                if(Val==el.value)
                                                {
                                                    isChecked=true;
                                                    
                                                  
                                                }
                                                    else
                                                {
                                                    isChecked=false;
                                                    
                                                }
                                                
                                                if(isChecked==true){
                                                    labelColor= this.colors(el.label);
                                                }
                                          option.push({
                                                color:labelColor, 
                                                FieldApiName:fieldN,
                                                option:el.label,
                                                checked:isChecked
                                            })
          
                                        })
           
          
                                        fieldName= data1.fields[fieldN].label;
                                        this.sCount= this.sCount+1;
                                    
                                            data.push(
                                            {
                                            SNO:this.sCount,
                                            Field:fieldName,
                                            Option:option
                                            });
           
                                    }
        
                                 })
                                //  this.colors(fieldN);
                         } 
                        
                                return data;
                }   

        Selected(event)
        {
           let col= this.colors(event.target.value);
            let ex =this.template.querySelectorAll('[data-field="fieldoption"]');
            //  console.log(ex);
            const fields={};
         
            var ApiFieldName=event.target.name;
           
            fields['Id']= this.recordId;
          
            const datetime= new Date();
            fields['TAS_Last_Modified_Date__c']= datetime.toISOString();;
          fields[ApiFieldName]= event.target.value;
            
          
            const recordInput= {fields};

        //  updateRecords(fields).then(()=>{
        //      console.log('Updated');
        //  }
        //  )
            updateRecord(recordInput).then(()=>{
               
                // new CustomEvent('recordchange')
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunity updated',
                        variant: 'success'
                    })
                );

              
             
           
            }) 
            // .then(() => this.refreshPage())

            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            
          
        }
   


         colors(color){
            
            // console.log(color);
             if(color=='Defined'||color=='Strong'||color=='Yes'||color=='High'||color=='Good')
             { 
                return'green';
                //  this.template.querySelector('[data-field="fieldoption"]').class="green";
               // document.querySelector("tr").style.backgroundColor="green";
            }
            else if(color=='Not Defined'||color=='Weak'||color=='Low'||color=='Poor' ||color=='No')
            {
                // this.template.querySelector('[data-field="fieldoption"]').class="red";
                return'red';
                // document.querySelector("tr").style.backgroundColor="red";
            }
            else if(color=='Unsure'){
                // this.template.querySelector('[data-field="fieldoption"]').class="yellow";
             return 'yellow';
          
            }
           
            
           
        }

        refreshPage() {
            window.location.reload();
          }



    }
