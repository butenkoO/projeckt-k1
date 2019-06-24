<?php
// Сообщение
$message = "all right";

// Отправляем
mail('andriybutenko94@gmail.com', 'My Subject', $message);
    if($mail){
        echo 'yas';
    }
    else {
        echo 'no';
    }
?>