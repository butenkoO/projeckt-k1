// при загрузці сторінки запускається функція
window.onload = function(){
    // глобальні змінні до яких буду потім звертатись
    let basket = {}; 
    let goods= {};
    let selectedGoods = {};
// перевіряємо чи пуста корзина
    function loadGoodsToBasket(){
        if(localStorage.getItem('basket') != null){
        basket = JSON.parse(localStorage.getItem('basket'));
        ledBasket();
        }
    }
        // запускаю функції для підгрузки товару з локал сторидж
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
            data = data['feed']['entry'];
            goods = helper(data);
            // запускаємо функції
            topgoods(data);
            showGoods(data);
            showBasket();

    }); 
    // функція, що відображає інформацію з товаром
    function showGoods(data){
        var out = '';
        for(var i = 0; i<data.length; i++){
            if(data[i]['gsx$show']['$t'] !=0){
                out += `<div class="${data[i]['gsx$class']['$t']} col-6 col-lg-3 col-md-4 text-center">`;
                out += `<div class="goods" name="goods" >`; 
                out += `<h3 class="goodsName">${data[i]['gsx$name']['$t']}</h3>`;
                out += `<img class="img rounded mx-auto d-block" src="${data[i]['gsx$image']['$t']}" alt="">`;
                out += `<p class="cost">Ціна: ${data[i]['gsx$cost']['$t']}грн.</p>`;
                out += `<p name="aboutBtn" id="${data[i]['gsx$id']['$t']}" class="aboutBtn">Детальніше про товар</p>`;
                out += `<p><button type="button" class="btn btn-success" name="addgood" data="${data[i]['gsx$id']['$t']}">В корзину</button></p>`;
                out += `</div>`;
                out += `</div>`;
            }
        }document.querySelector(".shop-field").innerHTML = out;
        
    }  

    // функція що відображає найбільш цікаві пропозиції
    function topgoods(data){
        var out = '';
        for(var i = 0; i<data.length; i++){
            if(data[i]['gsx$show']['$t'] !=0 && data[i]['gsx$top']['$t'] =='1'){
                out += `<div class="${data[i]['gsx$class']['$t']} col-6 col-lg-3 col-md-4 text-center">`;
                out += `<div class="goods" name="goods" >`;
                out += `<div class="hot">HOT</div>`;
                out += `<h3 class="goodsName">${data[i]['gsx$name']['$t']}</h3>`;
                out += `<img class="img rounded mx-auto d-block" src="${data[i]['gsx$image']['$t']}" alt="">`;
                out += `<p class="cost">Ціна: ${data[i]['gsx$cost']['$t']}грн.</p>`;
                out += `<p name="aboutBtn" id="${data[i]['gsx$id']['$t']}" class="aboutBtn">Детальніше про товар</p>`;
                out += `<p><button type="button" class="btn btn-success" name="addgood" data="${data[i]['gsx$id']['$t']}">В корзину</button></p>`;
                out += `</div>`;
                out += `</div>`;
            }
        }document.querySelector(".topgoods").innerHTML = out;
        
    } 
    // перелік певних дій в залежності від наших кліків
    document.onclick = function(e){
        // якщо зробити клік по області в якій немає імені - функція не буде запускатись
         if(e.target.attributes.name != undefined){
            // при кліку по кнопці з іменем addgood запускає функцію по добавлянню товару в корзину 
            if(e.target.attributes.name.nodeValue == 'addgood'){
                addGoods(e.target.attributes.data.nodeValue);
                //  видаляє товар з корзини + перезаписує корзину + оновлює локал сторидж
                } else if(e.target.attributes.name.nodeValue == 'del-goods'){
                    delete basket[e.target.attributes.data.nodeValue];
                    showBasket();
                    localStorage.setItem('basket', JSON.stringify(basket));
                    ledBasket();
                //  плюсує товар в корзині + перезаписує корзину + оновлює локал сторидж
                } else if(e.target.attributes.name.nodeValue == 'plus-goods'){
                    basket[e.target.attributes.data.nodeValue]++;
                    showBasket();
                    localStorage.setItem('basket', JSON.stringify(basket));
                    ledBasket();
                //  мінусує товар з корзини + перезаписує корзину + оновлює локал сторидж
                } else if(e.target.attributes.name.nodeValue == 'minus-goods'){
                    // якщо в корзині залишився 1 товар, ми його мінусуємо - товар видаляється з корзини
                    if(basket[e.target.attributes.data.nodeValue] -1 == 0) {
                        delete basket[e.target.attributes.data.nodeValue];
                        ledBasket();
                    // якщо в корзині ще є товар то просто мінусується на 1
                    } else {basket[e.target.attributes.data.nodeValue]--;}
                    showBasket();
                    localStorage.setItem('basket', JSON.stringify(basket));
                    ledBasket();
                    // відкриває модульне вікно + додає в нього товар по якому клікнув
                    } else if(e.target.attributes.name.nodeValue === 'aboutBtn'){
                        document.getElementById('about').style.display = "block"
                        let selectedGoodsId = e.target.attributes.id.nodeValue;
                        selectedGoods = goods[selectedGoodsId];
               
                        document.querySelector(".contentName").innerHTML =selectedGoods.name;
                        document.querySelector(".contentCost").innerHTML ="Ціна: " + selectedGoods.cost + "грн.";
                        document.querySelector(".contentAbout").innerHTML =selectedGoods.about;
                        document.getElementById('contentImage').src=selectedGoods.image;};
                        window.onclick = function(){
                            let modal = document.getElementById('modal');
                            if(event.target == about){
                            about.style.display = "none";
                            }if(event.target == modal){
                                modal.style.display = "none";
                              }
                          }
        }
    }
  
    // Добавляю товар в корзину (функція)
        function addGoods(elem){
            // якщо в обєкті баскет є елемент, який пробують добавити в корзину - він плюсується 
            if(basket[elem] !== undefined ){
                basket[elem]++;
            // якщо цього елементу немає - йому присвоюють значення 1
            }else {
                basket[elem] = 1;
            }
            // запуск функції по відображенню корзини
            showBasket();
            // добавляємо вміст корзини в локальну память
            localStorage.setItem('basket', JSON.stringify(basket));
            ledBasket();
        }

        //  функція перебирає goods для простішого звернення для нього
        function helper(arr){
            let out = {};
            for(let i = 0; i<arr.length; i++){
                let temp = {};
                temp['name'] = arr[i]['gsx$name']['$t'];
                temp['cost'] = arr[i]['gsx$cost']['$t'];
                temp['image'] = arr[i]['gsx$image']['$t'];
                temp['about'] = arr[i]['gsx$about']['$t'];
                temp['id'] = arr[i]['gsx$id']['$t'];
                out[ arr[i]['gsx$id']['$t'] ] = temp;
            }
            return out;
        }

    // відображаємо корзину
    function showBasket(){
        // озвучуємо перемінну і присвоюємо її корзині
       
        let ul = formSelectedGoods = document.querySelector('.basket');
        ul.innerHTML = '';
        let sum = 0;
        // перебираємо корзину
        for(let key in basket){
            let li = '<li>';
            li += 'id'+goods[key]['id']+' ';
            li += goods[key]['name']+' ';
            li += ` <button name="plus-goods" data="${key}">+</button>`;
            li += basket[key] + 'шт ';
            li += ` <button name="minus-goods" data="${key}">-</button>`;
            li += goods[key]['cost']*basket[key]+'грн.';
            li += ` <button name="del-goods" data="${key}">Видалити</button>`;
            li += '</li>';
            sum += goods[key]['cost']*basket[key];
            ul.innerHTML += li;
        }
        ul.innerHTML += 'Всього '+sum +'грн.';

        //значення корзини присвоюється формі для відправки
        selectedGoodsInForm();
     function selectedGoodsInForm(){
         let ni = document.querySelector('.file');
         ni.innerHTML = '';
         let sumi = 0;
         for(let key in basket){
             let li = '';
             li += 'id'+goods[key]['id']+' ';
             li += goods[key]['name']+' ';
             li += basket[key] + 'шт ';
             li += goods[key]['cost']*basket[key]+'грн.';
             sumi += goods[key]['cost']*basket[key];
             li += '  |||  ';
             ni.innerHTML += li;
          }
          ni.innerHTML += 'Всього '+sumi +'грн.';
         };
    }
  function ledBasket(){
        if(localStorage.getItem('basket') != '{}'){
            // document.querySelector("#bas").style.backgroundColor = 'rgba(253, 166, 51, 0.8)';
            document.querySelector("#bas").style.boxShadow = '0 0 24px rgb(253, 166, 51)';
        } else {
            document.querySelector("#bas").style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            document.querySelector("#bas").style.boxShadow = '0 0 24px rgb(255, 255, 255)';
        }
    };

}

// при завантеженні сторінки корзина закрита
// корзина відкривається/закривається по кліку
$( document ).ready(function(){
    $( ".basket-div" ).hide();
    $( ".slide-toggle" ).click(function(){
      $( ".basket-div" ).slideToggle(); 
    });
  });

//фільтрую товар по класам
  $( document ).ready(function(){
    $( ".all" ).click(function(){
      $( "[class^=tovar]" ).show();
    });

    $( ".pullover" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=pullover]" ).show();
      });

      $( ".T-shirt" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=T-shirt]" ).show();
      });

      $( ".jacket" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=jacket]" ).show();
      });

      $( ".pants" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=pants]" ).show();
      });

      $( ".shorts" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=shorts]" ).show();
      });

      $( ".bags" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=bags]" ).show();
      });

      $( ".mini-bags" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=mini-bag]" ).show();
      });

      $( ".cap" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=cap]" ).show();
      });

      $( ".balaclava" ).click(function(){
        $( "[class^=tovar]" ).hide();
        $( "[class*=balaclava]" ).show();
      });
  });

//  при нажатті на кнопку купити відкривається вікно з формою 
  let modal = document.getElementById('modal');
  let btn = document.getElementById("buy-btn");
  let closeA = document.querySelector(".close");

  btn.onclick = function(){
    modal.style.display = "block";
    console.log(basket);
  }
  closeA.onclick = function(){
    modal.style.display = "none";
  };
  window.onclick = function(){
    if(event.target == modal){
        modal.style.display = "none";
    }
};

    //   відправка форми на google sheets при нажаттні на submit
    $('#site_form').submit(function(e){
        e.preventDefault();
        formSubmit();
    })

    function formSubmit(){
        // присвоюємо змінним значення 
        let emailSubmitName = $('#emailClient').val();
        let nameSubmitName = $('#nameClient').val();
        let phoneSubmitName = $('#phone').val();
        let fileSubmitName = $('#file').val(); 
            if(nameSubmitName != '' && phoneSubmitName != ''){
                var $form = $('#site_form'), 
                url = 'https://script.google.com/macros/s/AKfycbyCCIHBOER6Hexo-Y5pAi4Z5ict_SikUroTLZDzgfCXzm3GMHU/exec'
                $.ajax({
                    url: url,
                    method: "GET",
                    dataType: "json",
                    data: $form.serialize(),
                    success: function(response){
                        modal.style.display = "none";
                        alert('Дякуємо за покупку! В найближчий час менеджер обовязково звяжеться з Вами!');
                        localStorage.clear();
                        let emptyBasket = 'Корзина порожня!';
                        document.querySelector(".basket").innerHTML = emptyBasket;
                        document.querySelector("#bas").style.backgroundColor = '';
                        return true
                    }
                })
            } else{
                alert('Корзина порожня!');
                return false
            }
    }
 