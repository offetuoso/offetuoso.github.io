$(document).on('click', '.social-icons__link',function(e) {
        
        if($(this).find('div').hasClass('icon_search')){
      		 e.preventDefault();
      		 fn_search();
        }
        
        
}); 

function fn_search(){
	alert('버튼 클릭!');
	
	if (isfetched === false) {
		searchFunc(path, 'local-search-input', 'local-search-result');
	} else {
		proceedsearch();
	};
}

