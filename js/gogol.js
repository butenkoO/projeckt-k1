window.onload = function(){
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
// підключаю гугл таблицю
    getJSON('https://spreadsheets.google.com/feeds/list/1vRD_wLzqPdST_zP_Tk8u0ApDXN-TDsOVYRtjdGtpNi0/od6/public/values?alt=json', 
    function(err, data){
        console.log(data);
        // якщо в підключенні таблиці вийшла помилка в консоль показує помилку
        if(err !== null){
            console.log('Error' + err);
        }
        // якщо все добре - починає зтягувати дані з таблиці в виді обєкту
        else {
            data = data['feed']['entry'];
            console.log(data);
            //  в DIV з класом .shop-field ми заміняємо весь вміст на функцію showGoods з дата даними які ми взяли з таблиці 
            document.querySelector(".shop-field").innerHTML = showGoods(data);
        }
    }); 
// тепер сама функція 
function showGoods(data){
    // змінна яка буде виводити результат
    var out = '';
    for(var i = 0; i<data.length; i++){
        // якщо в гугл таблиці в колонці товару show стоїть не 0 тоді дані по цьому товару відображаються
        if(data[i]['gsx$show']['$t'] !=0){
            out += `<div class="first col-6 col-lg-3 col-md-4 text-center">`;
            out += `<div class="goods" id="goods">`; 
            out += `<h5 class="goodsName">${data[i]['gsx$name']['$t']}</h5>`;
            out += `<img class="img" src="${data[i]['gsx$image']['$t']}" alt="">`;
            out += `<p class="cost">Ціна: ${data[i]['gsx$cost']['$t']}</p>`;
            out += `<p class="about">${data[i]['gsx$about']['$t']}</p>`;
            out += `</div>`;
            out += `</div>`;
        }
    }
    return out;
} 

}
