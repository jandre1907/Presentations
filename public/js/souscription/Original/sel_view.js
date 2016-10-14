/*********************************************************************************************************
 * View Part
 *********************************************************************************************************/
SEL.View = function(){
    this.log = function(utext) {
        if (console && console.log){
            console.log("View");
            //console.log(utext);
        } else {
            return function(){
                return true;
            }
        }
    };
};

SEL.View.prototype.appendView = function($scope, $compile, $element) {
    return function innerAddFormView(formObject){
        SEL.VIEW.log(formObject);
        $element.append(
            $compile(
                formObject
            )($scope)
        );
    };
}


SEL.View.prototype.prependView = function($scope, $compile, $element) {
    return function innerAddButtonView(formObject){
        SEL.VIEW.log(formObject);
        $element.prepend(
            $compile(
                formObject
            )($scope)
        );
    };
}