<?php

function get_item($arr, $key, $default='') {
    return (isset($arr[$key]) && $arr[$key])? $arr[$key] : $default;
}

function image_editor() {
    $pixel_size = 20;
    if (get_item($_POST, 'redo')) {
	$r = copy('../' . get_item($_POST, 'name') . '.gif', "orig");
	$isize = getimagesize("orig");
	$x = get_item($_POST, 'x', $isize[0]);
	$y = get_item($_POST, 'y', $isize[1]);
echo 'redo ' . $_POST['name'] . ':' . $x . ' ' . $y . ' ' . $isize[0] . ' ' . $isize[1] . 'whew';
    }
    else {
	$r = copy($_POST['url'], "orig");
	$isize = getimagesize("orig");
	$x = get_item($_POST, 'x');
	$y = get_item($_POST, 'y');
    }
    if (!$x && !$y)
	$y = 13;
    if (!$y)
	$y = round($x * $isize[1] / $isize[0]);
    else if (!$x)
	$x = round($y * $isize[0] / $isize[1]);
    echo $_POST['url'] . ': x ' . $x . ' y ' . $y . "<br>\n";
?>

<form name="tgmform" method="post">
<input type="hidden" value="" name="tgm_px" id="tgm_px">
<input type="hidden" value="<?php echo $x; ?>" name="tgm_x" id="tgm_x">
<input type="hidden" value="<?php echo $y; ?>" name="tgm_y" id="tgm_y">
<input type="hidden" value="<?php echo $_POST['name']; ?>" name="name">
<br>

<canvas id="tgm_canvas" width="<?php echo $pixel_size * $x; ?>" height="<?php echo $pixel_size * $y; ?>" style="border: 1px; border-color: #000000; border-style: solid;">
</canvas><br>
<canvas id="tgm_control" width="<?php echo 42 * $pixel_size; ?>" height="<?php echo 6 * $pixel_size; ?>" style="border: 1px; border-color: #000000; border-style: solid;">
</canvas><br>
<script type="text/javascript" src="tgm.js"></script>

<br>Debug: <span id="tgm_debug">Debug output here.</span><br>
<input type="submit" onClick="copy_pixels();">

</form><br>
<img id="tgm_source" src="orig" border=1>
<img id="tgm_ctl_gif" src="controls.gif" style="display: none;">

<?php
}

function create_image() {
    $xmax = $_POST['tgm_x'];
    $ymax = $_POST['tgm_y'];

    $gd = imagecreatetruecolor($xmax, $ymax);

    $x = $y = 0;
    $pxls = explode(' ', $_POST['tgm_px']);
    foreach ($pxls as $p) {
	if (!strlen($p))
	    continue;
	if ($p == 217) {
	    $r = $g = $b = 230;
	}
	else {
	    $r = 51 * floor($p / 36);
	    $g = 51 * floor(($p % 36) / 6);
	    $b = 51 * floor($p % 6);
	}
	$c = $r * 65536 + $g * 256 + $b;
	imagesetpixel($gd, $x, $y, $c);
	$x += 1;
	if ($x >= $xmax) {
	    $x = 0;
	    $y += 1;
	}
    }
    return $gd;
}

function show_as_png($gd) {
    imagepng($gd);
}

function save_as_png($gd, $dest) {
    echo 'saving as ' . $dest . ":<br>\n";
    imagepng($gd, $dest);
    echo '<img src="' . $dest . '">';
}

function finish($gd) {
    imagedestroy($gd);
}

function initial_form() {
?>

<form name="tgmform" method="post">
URL to grab: <input type="text" size="128" name="url" value="<?php echo get_item($_GET, 'url'); ?>">
<input type="checkbox" name="redo"> redo<br>
Final name: <input type="text" name="name" value="<?php echo get_item($_GET, 'name'); ?>"><br>
X size: <input type="text" name="x" value="<?php echo get_item($_GET, 'x'); ?>"><br>
Y size: <input type="text" name="y" value="<?php echo get_item($_GET, 'y'); ?>"><br>
<input type="submit">
</form>

<?php
}
?>
