/**
 * Usage:
 * <p ng-bind-html="myVar|nl2br"></p>
 */
angular.module('jehu.nl2br',[]).filter('nl2br',function() {
    return function(string,is_xhtml) { 
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';    
        return (string + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    }
});
