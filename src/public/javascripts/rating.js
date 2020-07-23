function starRate() {
    var l = $('i#rate');
    var temp = 5;
    var final = l.length;
    show(temp);
    document.getElementById('rateNo').setAttribute('value', temp.toString());
    for (let i = 0; i < l.length; i++) {
        l[i].onmouseover = function () {
            this.style.cursor='hand';
            show(i+1);
        };
        l[i].onmouseout = function () {
            show(temp);
        };
        l[i].onclick  = function () {
            temp = i+1;
            document.getElementById('rateNo').setAttribute('value', temp.toString());
            show(temp);
        }
    }
    function show(num) {
        for (let s = 0; s < final; s++) {
            if (s < num) {
                l[s].classList.add("checked");
            }
            else {
                l[s].classList.remove("checked");
            }
        }
    }
}

function review(product, order) {
    document.getElementById('review-box').hidden = false;
    var des = '/order/'+order;
    document.getElementById('form-review').setAttribute('action', des);
    starRate();
    document.getElementById('sp_id').setAttribute('value', product);
    document.getElementById('po_no').setAttribute('value', order);
}



