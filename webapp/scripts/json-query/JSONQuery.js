/*
Copyright Jason E. Smith 2008 Licensed under the Apache License, Version 2.0 (the "License");
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/
 
 
/*
* CREDITS:
* Thanks to Kris Zyp from SitePen for contributing his source for
* a standalone port of JSONQuery (from the dojox.json.query module).
*
* OVERVIEW:
* JSONQuery.js is a standalone port of the dojox.json.query module. It is intended as
* a dropin solution with zero dependencies. JSONQuery is intended to succeed and improve upon
* the JSONPath api (http://goessner.net/articles/JsonPath/) which offers rich powerful
* querying capabilities similar to those of XQuery.
*
* EXAMPLES / USAGE:
* see http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/
*
*     *Ripped from original source.
*         JSONQuery(queryString,object)
        and
        JSONQuery(queryString)(object)
        always return identical results. The first one immediately evaluates, the second one returns a
        function that then evaluates the object.
      
      example:
        JSONQuery("foo",{foo:"bar"})
        This will return "bar".
    
      example:
        evaluator = JSONQuery("?foo='bar'&rating>3");
        This creates a function that finds all the objects in an array with a property
        foo that is equals to "bar" and with a rating property with a value greater
        than 3.
        evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
        This returns:
        {foo:"bar",rating:4}
      
      example:
        evaluator = JSONQuery("$[?price<15.00][\rating][0:10]");
        This finds objects in array with a price less than 15.00 and sorts then
        by rating, highest rated first, and returns the first ten items in from this
        filtered and sorted list.
        
        
	example:      
		var data = {customers:[
			{name:"Susan", purchases:29},
			{name:"Kim", purchases:150}, 
			{name:"Jake", purchases:27}
		]};
		
		var results = json.JSONQuery("$.customers[?purchases > 21 & name='Jake'][\\purchases]",data);
		results 
		
		returns customers sorted by higest number of purchases to lowest.

*/

(function(){
    function map(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array(len);
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr)
                res[i] = fun.call(thisp, arr[i], i, arr);
        }
        
        return res;
    }
 
   function filter(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array();
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                var val = arr[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, arr))
                    res.push(val);
            }
        }
        
        return res;
    };
 
 
  function slice(obj,start,end,step){
    // handles slice operations: [3:6:2]
    var len=obj.length,results = [];
    end = end || len;
    start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
    end = (end < 0) ? Math.max(0,end+len) : Math.min(len,end);
     for(var i=start; i<end; i+=step){
       results.push(obj[i]);
     }
    return results;
  }
  function expand(obj,name){
    // handles ..name, .*, [*], [val1,val2], [val]
    // name can be a property to search for, undefined for full recursive, or an array for picking by index
    var results = [];
    function walk(obj){
      if(name){
        if(name===true && !(obj instanceof Array)){
          //recursive object search
          results.push(obj);
        }else if(obj[name]){
          // found the name, add to our results
          results.push(obj[name]);
        }
      }
      for(var i in obj){
        var val = obj[i];
        if(!name){
          // if we don't have a name we are just getting all the properties values (.* or [*])
          results.push(val);
        }else if(val && typeof val == 'object'){
          
          walk(val);
        }
      }
    }
    if(name instanceof Array){
      // this is called when multiple items are in the brackets: [3,4,5]
      if(name.length==1){
        // this can happen as a result of the parser becoming confused about commas
        // in the brackets like [@.func(4,2)]. Fixing the parser would require recursive
        // analsys, very expensive, but this fixes the problem nicely.
        return obj[name[0]];
      }
      for(var i = 0; i < name.length; i++){
        results.push(obj[name[i]]);
      }
    }else{
      // otherwise we expanding
      walk(obj);
    }
    return results;
  }
  
  function distinctFilter(array, callback){
    // does the filter with removal of duplicates in O(n)
    var outArr = [];
    var primitives = {};
    for(var i=0,l=array.length; i<l; ++i){
      var value = array[i];
      if(callback(value, i, array)){
        if((typeof value == 'object') && value){
          // with objects we prevent duplicates with a marker property
          if(!value.__included){
            value.__included = true;
            outArr.push(value);
          }
        }else if(!primitives[value + typeof value]){
          // with primitives we prevent duplicates by putting it in a map
          primitives[value + typeof value] = true;
          outArr.push(value);
        }
      }
    }
    for(i=0,l=outArr.length; i<l; ++i){
      // cleanup the marker properties
      if(outArr[i]){
        delete outArr[i].__included;
      }
    }
    return outArr;
  }
  var JSONQuery = function(/*String*/query,/*Object?*/obj){
    // summary:
    //     Performs a JSONQuery on the provided object and returns the results.
    //     If no object is provided (just a query), it returns a "compiled" function that evaluates objects
    //     according to the provided query.
    // query:
    //     Query string
    //   obj:
    //     Target of the JSONQuery
    //
    //  description:
    //    JSONQuery provides a comprehensive set of data querying tools including filtering,
    //    recursive search, sorting, mapping, range selection, and powerful expressions with
    //    wildcard string comparisons and various operators. JSONQuery generally supersets
    //     JSONPath and provides syntax that matches and behaves like JavaScript where
    //     possible.
    //
    //    JSONQuery evaluations begin with the provided object, which can referenced with
    //     $. From
    //     the starting object, various operators can be successively applied, each operating
    //     on the result of the last operation.
    //
    //     Supported Operators:
    //     --------------------
    //    * .property - This will return the provided property of the object, behaving exactly
    //     like JavaScript.
    //     * [expression] - This returns the property name/index defined by the evaluation of
    //     the provided expression, behaving exactly like JavaScript.
    //    * [?expression] - This will perform a filter operation on an array, returning all the
    //     items in an array that match the provided expression. This operator does not
    //    need to be in brackets, you can simply use ?expression, but since it does not
    //    have any containment, no operators can be used afterwards when used
    //     without brackets.
    //    * [^?expression] - This will perform a distinct filter operation on an array. This behaves
    //    as [?expression] except that it will remove any duplicate values/objects from the
    //    result set.
    //     * [/expression], [\expression], [/expression, /expression] - This performs a sort
    //     operation on an array, with sort based on the provide expression. Multiple comma delimited sort
    //     expressions can be provided for multiple sort orders (first being highest priority). /
    //    indicates ascending order and \ indicates descending order
    //     * [=expression] - This performs a map operation on an array, creating a new array
    //    with each item being the evaluation of the expression for each item in the source array.
    //    * [start:end:step] - This performs an array slice/range operation, returning the elements
    //    from the optional start index to the optional end index, stepping by the optional step number.
    //     * [expr,expr] - This a union operator, returning an array of all the property/index values from
    //     the evaluation of the comma delimited expressions.
    //     * .* or [*] - This returns the values of all the properties of the current object.
    //     * $ - This is the root object, If a JSONQuery expression does not being with a $,
    //     it will be auto-inserted at the beginning.
    //     * @ - This is the current object in filter, sort, and map expressions. This is generally
    //     not necessary, names are auto-converted to property references of the current object
    //     in expressions.
    //     *  ..property - Performs a recursive search for the given property name, returning
    //     an array of all values with such a property name in the current object and any subobjects
    //     * expr = expr - Performs a comparison (like JS's ==). When comparing to
    //     a string, the comparison string may contain wildcards * (matches any number of
    //     characters) and ? (matches any single character).
    //     * expr ~ expr - Performs a string comparison with case insensitivity.
    //    * ..[?expression] - This will perform a deep search filter operation on all the objects and
    //     subobjects of the current data. Rather than only searching an array, this will search
    //     property values, arrays, and their children.
    //    * $1,$2,$3, etc. - These are references to extra parameters passed to the query
    //    function or the evaluator function.
    //    * +, -, /, *, &, |, %, (, ), <, >, <=, >=, != - These operators behave just as they do
    //     in JavaScript.
    //    
    //  
    //  
    //   |  dojox.json.query(queryString,object)
    //     and
    //   |  dojox.json.query(queryString)(object)
    //     always return identical results. The first one immediately evaluates, the second one returns a
    //     function that then evaluates the object.
    //
    //   example:
    //   |  dojox.json.query("foo",{foo:"bar"})
    //     This will return "bar".
    //
    //  example:
    //  |  evaluator = dojox.json.query("?foo='bar'&rating>3");
    //    This creates a function that finds all the objects in an array with a property
    //    foo that is equals to "bar" and with a rating property with a value greater
    //    than 3.
    //  |  evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
    //     This returns:
    //   |  {foo:"bar",rating:4}
    //
    //  example:
    //   |  evaluator = dojox.json.query("$[?price<15.00][\rating][0:10]");
    //      This finds objects in array with a price less than 15.00 and sorts then
    //     by rating, highest rated first, and returns the first ten items in from this
    //     filtered and sorted list.
    tokens = [];
    var depth = 0;  
    var str = [];
    query = query.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g,function(t){
      depth += t == '[' ? 1 : t == ']' ? -1 : 0; // keep track of bracket depth
      return (t == ']' && depth > 0) ? '`]' : // we mark all the inner brackets as skippable
          (t.charAt(0) == '"' || t.charAt(0) == "'") ? "`" + (str.push(t) - 1) :// and replace all the strings
            t;
    });
    var prefix = '';
    function call(name){
      // creates a function call and puts the expression so far in a parameter for a call
      prefix = name + "(" + prefix;
    }
    function makeRegex(t,a,b,c,d){
      // creates a regular expression matcher for when wildcards and ignore case is used
      return str[d].match(/[\*\?]/) || c == '~' ?
          "/^" + str[d].substring(1,str[d].length-1).replace(/\\([btnfr\\"'])|([^\w\*\?])/g,"\\$1$2").replace(/([\*\?])/g,".$1") + (c == '~' ? '$/i' : '$/') + ".test(" + a + ")" :
          t;
    }
    query.replace(/(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,function(){
      throw new Error("Unsafe function call");
    });
    
    query = query.replace(/([^=]=)([^=])/g,"$1=$2"). // change the equals to comparisons
      replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g,function(t){
        return t.charAt(0) == '.' ? t : // leave .prop alone
          t == '@' ? "$obj" :// the reference to the current object
          (t.match(/:|^(\$|Math|true|false|null)$/) ? "" : "$obj.") + t; // plain names should be properties of root... unless they are a label in object initializer
      }).
      replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,function(t,a,b){
        var oper = t.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/); // [?expr] and ?expr and [=expr and =expr
        if(oper){
          var prefix = '';
          if(t.match(/^\./)){
            // recursive object search
            call("expand");
            prefix = ",true)";
          }
          call(oper[1].match(/\=/) ? "map" : oper[1].match(/\^/) ? "distinctFilter" : "filter");
          return prefix + ",function($obj){return " + oper[2] + "})";
        }
        oper = t.match(/^\[\s*([\/\\].*)\]/); // [/sortexpr,\sortexpr]
        if(oper){
          // make a copy of the array and then sort it using the sorting expression
          return ".concat().sort(function(a,b){" + oper[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g,function(t,a,b){
              return "var av= " + b.replace(/\$obj/,"a") + ",bv= " + b.replace(/\$obj/,"b") + // FIXME: Should check to make sure the $obj token isn't followed by characters
                  ";if(av>bv||bv==null){return " + (a== "/" ? 1 : -1) +";}\n" +
                  "if(bv>av||av==null){return " + (a== "/" ? -1 : 1) +";}\n";
          }) + "})";
        }
        oper = t.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/); // slice [0:3]
        if(oper){
          call("slice");
          return "," + (oper[1] || 0) + "," + (oper[2] || 0) + "," + (oper[3] || 1) + ")";
        }
        if(t.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)){ // ..prop and [*]
          call("expand");
          return (t.charAt(1) == '.' ?
              ",'" + b + "'" : // ..prop
                t.match(/,/) ?
                  "," + t : // [prop1,prop2]
                  "") + ")"; // [*]
        }
        return t;
      }).
      replace(/(\$obj\s*(\.\s*[\w_$]+\s*)*)(==|~)\s*`([0-9]+)/g,makeRegex). // create regex matching
      replace(/`([0-9]+)\s*(==|~)\s*(\$obj(\s*\.\s*[\w_$]+)*)/g,function(t,a,b,c,d){ // and do it for reverse =
        return makeRegex(t,c,d,b,a);
      });
    query = prefix + (query.charAt(0) == '$' ? "" : "$") + query.replace(/`([0-9]+|\])/g,function(t,a){
      //restore the strings
      return a == ']' ? ']' : str[a];
    });
    // create a function within this scope (so it can use expand and slice)
    
    var executor = eval("1&&function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj=$;return " + query + "}");
    for(var i = 0;i<arguments.length-1;i++){
      arguments[i] = arguments[i+1];
    }
    return obj ? executor.apply(this,arguments) : executor;
  };
  
  
  if(typeof namespace == "function"){
  	namespace("json::JSONQuery", JSONQuery);
  }
  else {
  	window["JSONQuery"] = JSONQuery;
  }
})();