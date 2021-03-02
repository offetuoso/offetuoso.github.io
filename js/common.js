
var searchQuery = '';


$(document).on("keyup", "input[id='local-search-input']", function () {
	searchQuery = $("input[id='local-search-input']").val();    
    if(searchQuery != ''){
	    search(searchQuery);
    }else{
   		$("#local-search-result").empty();
   		$("#local-search-result").html('<div id="no-result"><i class="fa fa-search fa-5x" /></div>');   		
    }
    
});

function search(searchQuery){
  var result;
  $.getJSON( "/index.json", function( data ) {
    var pages = data;
    var fuse = new Fuse(pages, fuseOptions);
    result = fuse.search(searchQuery);
    console.log({"matches":result});
    
    $("#local-search-result").empty();
    
    if(result.length > 0){
      searchResults(result);
    }else{
   	 $('#local-search-result').append("<p>No matches found</p>");
    }
    
    
  });
  
  return result;
}
  
function searchResults(result){
  $.each(result,function(key,value){
    var contents= value.item.content;
    var snippet = "";
    var snippetHighlights=[];
    var tags =[];
    if( fuseOptions.tokenize ){
      snippetHighlights.push(searchQuery);
    }else{
      $.each(value.matches,function(matchKey,mvalue){
        if(mvalue.key == "tags" || mvalue.key == "categories" ){
          snippetHighlights.push(mvalue.value);
        }else if(mvalue.key == "contents"){
          start = mvalue.indices[0][0]-summaryInclude>0?mvalue.indices[0][0]-summaryInclude:0;
          end = mvalue.indices[0][1]+summaryInclude<contents.length?mvalue.indices[0][1]+summaryInclude:contents.length;
          snippet += contents.substring(start,end);
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0],mvalue.indices[0][1]-mvalue.indices[0][0]+1));
        }
      });
    }

    if(snippet.length<1){
      snippet += contents.substring(0,summaryInclude*2);
    }
    //pull template from hugo templarte definition
    var templateDefinition = $('#search-result-template').html();
    //replace values
    var output = render(templateDefinition,{key:key,title:value.item.title,link:value.item.uri,tags:value.item.tags,categories:value.item.categories,snippet:snippet});
    console.log(output);
    $('#local-search-result').append(output);

    $.each(snippetHighlights,function(snipkey,snipvalue){
      $("#summary-"+key).mark(snipvalue);
    });

  });
}


$(document).on('click', '.popup-btn-close',function(e) {
     onPopupClose();
});

 
$(document).on('click', '.social-icons__link',function(e) {
        
        if($(this).find('div').hasClass('icon_search')){
      		 e.preventDefault();
      		 proceedsearch();
        }
        
}); 


function proceedsearch() {
      $("body").append('<div class="search-popup-overlay local-search-pop-overlay"></div>').css('overflow', 'hidden');
      $('.search-popup-overlay').click(onPopupClose);
      $('.popup').toggle();
      var $localSearchInput = $('#local-search-input');
      $localSearchInput.attr("autocapitalize", "none");
      $localSearchInput.attr("autocorrect", "off");
      $localSearchInput.focus();
      $("#local-search-result").html('<div id="no-result"><i class="fa fa-search fa-5x" /></div>');
}



var onPopupClose = function (e) {
      $('.popup').hide();
      $('#local-search-input').val('');
      $('.search-result-list').remove();
      $('#no-result').remove();
      $(".local-search-pop-overlay").remove();
      $('body').css('overflow', '');
}
    
    


