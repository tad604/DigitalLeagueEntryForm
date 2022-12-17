//requires jQuery
const  NAMES_SUGGESTION_URL = GOOGLE_SHEET_URL;
(function($){
   $.fn.playerNameSuggest = function(options){
     let el = $(this);
     let myOptions = {
        "source":getNameSuggestions,
         "minCharInput":1,
         "delay": 200
     };
     if(options !== undefined){
       myOptions = $.extend(myOptions, options);
     }
     el.autocomplete({
        delay: myOptions.delay,
        minLength: myOptions.minCharInput,
        source: function (request, response){
          myOptions.source(request, response);
        }
     });
   };
})(jQuery);

function getNameSuggestions(text, callback){
  jQuery.getJSON(NAMES_SUGGESTION_URL,
    {'fnc': 'suggest', 'text':text.term},
    function(data){
     callback(data.suggestions);
    });
}
window.addEventListener("load", ()=>{
  jQuery("#playerName1").playerNameSuggest();
  jQuery("#playerName2").playerNameSuggest();
  jQuery("#playerName3").playerNameSuggest();
  jQuery("#playerName4").playerNameSuggest();
});
