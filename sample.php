<!DOCTYPE HTML>
<html>
<head><meta charset="UTF-8"><title>Tiny GIF Maker</title>
</head>
<body>

<?php
include "tgm.php";

if (get_item($_POST, 'url')) {
    image_editor();
}
else if (get_item($_POST, 'tgm_px')) {
    $gd = create_image();
    $name = 'out/' . get_item($_POST, 'name', 'new') . '.png';
    show_as_png($gd);
    finish($gd);
}
else {
    initial_form();
}
?>

</body>
</html>
