public class getOppRecordController {
    
// @AuraEnabled(cacheable=true)
    // public static List<Opportunity> displayRecords()
    //     {
    //         return[SELECT Id,name FROM Opportunity];
    //       }
          @AuraEnabled(cacheable=true)
           public static map<String,List<String>> pick() 
           {
            map<String,List<String>> mapPickOptions = new map<String,List<String>>();
            Schema.DescribeSObjectResult objDescribe = Schema.getGlobalDescribe().get('Opportunity').getDescribe() ;
            Map<String,Schema.SObjectField> fields = objDescribe.fields.getMap() ;
            for( String fld : fields.keySet() ){
              Schema.DescribeFieldResult fieldResult = fields.get(fld).getDescribe();
                if( fieldResult.getType()+'' == 'PICKLIST' ){
                    List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
                    String[] temp = new String[]{};
                  for( Schema.PicklistEntry pickListVal : ple){
                        temp.add( pickListVal.getValue() );
                    }
                    mapPickOptions.put( fld, temp );
                } 
            }
            return mapPickOptions;
          }
}
