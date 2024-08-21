<?php

if ($_FILES['img']['type'] != 'image/jpeg'){
	$img = imagecreatefromjpeg($_FILES['img']['tmp_name']);

	imagejpeg($img, "images/$_GET[lobbynameid].jpg", 70);
}

?>