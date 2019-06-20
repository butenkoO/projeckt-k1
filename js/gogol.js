window.onload = function(){
    let basket = {}; 
    let goods= {};
// перевіряємо чи пуста корзина
    function loadGoodsToBasket(){
        if(localStorage.getItem('basket') != null){
    basket = JSON.parse(localStorage.getItem('basket'));
    }
    }
loadGoodsToBasket();

    // відправляємо запит на AJAX
    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType= 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if(status == 200) {
                callback(null, xhr.response)
            }
            else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }
// підключаю дані з google tabs 
    getJSON('https://spreadsheets.google.com/feeds/list/1vRD_wLzqPdST_zP_Tk8u0ApDXN-TDsOVYRtjdGtpNi0/od6/public/values?alt=json', 
    function(err, data){
        console.log(data);
        if(err !== null){
            console.log('Error' + err);
        }
        else {
            data = data['feed']['entry'];
            console.log(data);
            goods = helper(data);
            console.log(goods);
            // міняю вміст Div на товар
            document.querySelector(".shop-field").innerHTML = showGoods(data);
            showBasket();
        }
    }); 
// функція, що відображає інформацію з товаром
function showGoods(data){
    var out = '';
    for(var i = 0; i<data.length; i++){
        if(data[i]['gsx$show']['$t'] !=0){
            out += `<div class="${data[i]['gsx$class']['$t']} col-6 col-lg-3 col-md-4 text-center">`;
            out += `<div class="goods" id="goods">`; 
            out += `<h3 class="goodsName">${data[i]['gsx$name']['$t']}</h3>`;
            out += `<img class="img rounded mx-auto d-block" src="${data[i]['gsx$image']['$t']}" alt="">`;
            out += `<p class="cost">Ціна: ${data[i]['gsx$cost']['$t']}грн.</p>`;
            out += `<p class="about">${data[i]['gsx$about']['$t']}</p>`;
            out += `<p><button type="button" class="btn btn-success" name="addgood" data="${data[i]['gsx$id']['$t']}">В корзину</button></p>`;
            out += `</div>`;
            out += `</div>`;
        }
    }
    return out;
} 

// якщо нажати на кнопку "В корзину" запуститься функція для додавання товару
document.onclick = function(e){
    if(e.target.attributes.name != undefined){
    if(e.target.attributes.name.nodeValue == 'addgood'){
        addGoods(e.target.attributes.data.nodeValue);
    } else if(e.target.attributes.name.nodeValue == 'del-goods'){
        delete basket[e.target.attributes.data.nodeValue];
        showBasket();
        localStorage.setItem('basket', JSON.stringify(basket));
    } else if(e.target.attributes.name.nodeValue == 'plus-goods'){
        basket[e.target.attributes.data.nodeValue]++;
        showBasket();
        localStorage.setItem('basket', JSON.stringify(basket));
    } else if(e.target.attributes.name.nodeValue == 'minus-goods'){
        if(basket[e.target.attributes.data.nodeValue] -1 == 0) {
            delete basket[e.target.attributes.data.nodeValue];
        } else {basket[e.target.attributes.data.nodeValue]--;}
        showBasket();
        localStorage.setItem('basket', JSON.stringify(basket));
        }
    }
}

// Добавляю товар в корзину (функція)
    function addGoods(elem){
        if(basket[elem] !== undefined ){
            basket[elem]++;
        }else {
            basket[elem] = 1;
        }
        console.log(basket);
        showBasket();
        // добавляємо вміст корзини в локальну память
        localStorage.setItem('basket', JSON.stringify(basket));
    }

function helper(arr){
    let out = {};
    for(let i = 0; i<arr.length; i++){
        let temp = {};
        temp['name'] = arr[i]['gsx$name']['$t'];
        temp['cost'] = arr[i]['gsx$cost']['$t'];
        temp['image'] = arr[i]['gsx$image']['$t'];
        temp['about'] = arr[i]['gsx$about']['$t'];
        out[ arr[i]['gsx$id']['$t'] ] = temp;
    }
    return out;
}

// добавляємо саму корзину
function showBasket(){
    let ul = document.querySelector('.basket');
    ul.innerHTML = '';
    let sum = 0;
    for(let key in basket){
        let li = '<li>';
        li += goods[key]['name']+' ';
        li += ` <button name="minus-goods" data="${key}">-</button>`;
        li += basket[key] + 'шт ';
        li += ` <button name="plus-goods" data="${key}">+</button>`;
        li += goods[key]['cost']*basket[key]+'грн.';
        li += ` <button name="del-goods" data="${key}">Видалити</button>`;
        li += '</li>';
        sum += goods[key]['cost']*basket[key];
        ul.innerHTML += li;
     }
     ul.innerHTML += 'Всього '+sum +'грн.';
}


}

$( document ).ready(function(){
    $( ".slide-toggle" ).click(function(){
      $( ".basket-div" ).slideToggle(); 
    });
  });
  $( document ).ready(function(){
    $( ".all" ).click(function(){
      $( "[class^=tovar]" ).show();
    });

    $( ".qwe" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=short]" ).show();
      });

      $( ".asd" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=bag]" ).show();
      });

      $( ".zxc" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=pant]" ).show();
      });
  });