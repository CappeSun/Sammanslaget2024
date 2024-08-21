<?php

$images = [];
for ($i=0; $i < 9; $i++){
	$images[] = file_exists("card_images/$_GET[name]$i.jpg") ? "card_images/$_GET[name]$i.jpg" : null;
}

echo json_encode($images);

?>