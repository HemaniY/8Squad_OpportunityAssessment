({
    view : function(component, event, helper) {
        console.log(event);
        $A.get('e.force:refreshView').fire();
        
        console.log('it fired');
    }
    
})
