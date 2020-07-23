
function jumpToPage(current_page, maxPage, value) {
    var url = '/products';
    if (isNaN(value) || value.length === 0 || value <= 0) {
        alert('Please input valid number');
        url += '?page='+current_page;
        window.location.href = url;

    } else if(value > maxPage) {
        url += '?page='+maxPage;
        window.location.href = url;
    } else {
        url += '?page='+value;
        window.location.href = url;
    }
}


function jumpToPageWithSearch(current_page, maxPage, search, keyword, value ) {
    var url = '/products?search=' + search + '&keyword=' + keyword;
    if (isNaN(value) || value.length === 0 || value <= 0) {
        alert('Please input valid number');
        url += '&page='+current_page;
        window.location.href = url;
    } else if(value > maxPage) {
        url += '&page='+maxPage;
        window.location.href = url;
    } else {
        url += '&page='+value;
        window.location.href = url;
    }
}

