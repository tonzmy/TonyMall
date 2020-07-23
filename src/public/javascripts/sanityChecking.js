function changePrice(id) {
    var x = $('#price').val();
    if (x.length === 0 || isNaN(x) || x < 0 || x.length > 8) {
        document.getElementById('invalid').hidden = false;
    }
    else {
        document.getElementById('invalid').hidden = true;
        var url = '/vendor/order/changeprice?id=' + id + '&price=' + x;
        window.location.href = url;
    }
}


function search() {
    var x = $('#input_1').val();
    if (x.length === 0 || isNaN(x) || x <= 0) {
        alert('Please input valid keyword');
        return $('table#table_purchase tbody tr').show();
    }
    else {
        $('table#table_purchase tbody tr').hide().filter(function () {
            return $(this).children(':eq(0)').find('a').text() == x;}).show();
    }
};

function analyze() {
    var x = $('#input2').val();
    var y = $('.custom-select').val();
    if (x.length === 0 || isNaN(x) || x <= 0) {
        alert('Please input valid and reasonable number');
        // window.location.href = url;
        return;
    } else if (y == 1) {
        var url = '/vendor/order/analysis?measure=quantity&period=';
        url += x;
        window.location.href = url;
    } else {
        var url = '/vendor/order/analysis?measure=amount&period=';
        url += x;
        window.location.href = url;
    }
}

function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

function checkForm(key){
    if ( isNull(key) )   alert("Forget to input keyword ?");
    else   location.href='/products/?search='+$('#sel').val()+'&keyword='+$('#input-search').val();
}

