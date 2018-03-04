
// tgm_px - pixels created
// tgm_source - source image
// tgm_canvas - drawing canvas element
// tgm_control - controls canvas element
// tgm_debug - debug string

const pxl_size = 20;
const max_x = 32;
const max_y = 16;
const no_coord = [-1, -1];
const transp_coord = [36, 0];
const transp_clr = [6, 6, 6];
const transp_hex = '#E6E6E6';
var dbg;
var pxf;
var ctl;
var src;
var can;
var szx;
var szy;
var pxls = [];
var clr_draw = [0, 0, 0];
var cur_coord = [-1, -1];
var clr_coord = [0, 0];
var dmd_coord = [36, 5];
var dmode = 0;
var ctl_coord = no_coord;

function copy(ctx, coord_from, w, h, coord_to) {
    var imgData=ctx.getImageData(coord_from[0], coord_from[1], w, h);
    ctx.putImageData(imgData, coord_to[0], coord_to[1]);
}

function eq(a, b) {
    return !(a < b || b < a);
}

function ne(a, b) {
    return a < b || b < a;
}

function tgm_start() {
    dbg = document.getElementById('tgm_debug');
    pxf = document.getElementById('tgm_px');
    ctl = document.getElementById('tgm_control');
    src = document.getElementById("tgm_source");
    can = document.getElementById("tgm_canvas");
    szx = document.getElementById('tgm_x').value;
    szy = document.getElementById('tgm_y').value;
    draw_controls();
    draw_canvas();
    ctl.addEventListener("mousedown", ctl_buttondown);
    ctl.addEventListener("mouseup", ctl_buttonup);
    ctl.addEventListener("mouseenter", ctl_mouse);
    ctl.addEventListener("mouseleave", ctl_mouse);
    ctl.addEventListener("mousemove", ctl_mouse);
    ctl.addEventListener("dblclick", ctl_doubleclick);
    can.addEventListener("mousedown", can_buttondown);
    can.addEventListener("mouseup", can_buttonup);
    can.addEventListener("mouseenter", can_mouse);
    can.addEventListener("mouseleave", can_mouse);
    can.addEventListener("mousemove", can_mouse);
    can.addEventListener("dblclick", can_doubleclick);
    document.addEventListener("keypress", can_key);
}

function make_color(v) {
    if (eq(v, transp_clr))
	return transp_hex;
    const clrs = ["00", "33", "66", "99", "CC", "FF"];
    var res = "#" + clrs[v[0]] + clrs[v[1]] + clrs[v[2]];
    return res;
}

function draw_controls() {
    var ctx = ctl.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 324, 54);
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    for (y = 0; y <= 6; y++) {
	ctx.moveTo(0, y * pxl_size);
	ctx.lineTo(42 * pxl_size, y * pxl_size);
    }
    for (x = 0; x <= 36; x++) {
	ctx.moveTo(x * pxl_size, 0);
	ctx.lineTo(x * pxl_size, 6 * pxl_size);
    }
    ctx.moveTo(42 * pxl_size, 0);
    ctx.lineTo(42 * pxl_size, 6 * pxl_size);
    for (r = 0; r < 6; r++) {
	for (g = 0; g < 6; g++) {
	    for (b = 0; b < 6; b++) {
		fill_pixel_box(ctx, make_color([r, g, b]), color_to_coord([r, g, b]));
	    }
	}
    }
    ctx.font="12px Courier";
    ctx.fillStyle = "#000000";
    ctx.fillText(szx + ' x ' + szy, 39 * pxl_size + 5, 3 * pxl_size - 5);
    ctx.stroke();
    ctx.drawImage(document.getElementById("tgm_ctl_gif"), 36 * pxl_size, 0);
    ctx.drawImage(src, 37 * pxl_size + 2, 2, szx, szy);
    import_image(ctx)
    draw_pixel_box(ctx, 1, color_to_coord(clr_draw));
    draw_pixel_box(ctx, 1, dmode_to_coord(dmode));
}

function ws(x) {
    return Math.floor((x + 25) / 51);
}

function import_image(ctx) {
    var pxl;
    pxls = [];
    for (x = 0; x <= szx; x++) {
	pxls[x] = [];
	for (y = 0; y <= szy; y++) {
	    //ctx.drawImage(src, 37 * pxl_size + 2, 2, szx, szy);
	    pxl = ctx.getImageData(37 * pxl_size + 2 + x, 2 + y, 1, 1).data;
	    pxls[x][y] = [ws(pxl[0]), ws(pxl[1]), ws(pxl[2])];
	}
    }
}

function coord_to_color(coord) {
    if (eq(coord, transp_coord))
	return transp_clr;
    return [coord[1], coord[0] % 6, Math.floor(coord[0] / 6)];
}

function color_to_coord(clr) {
    if (eq(clr, transp_clr))
	return transp_coord;
    return [(clr[2] * 6) + clr[1], clr[0]];
}

function dmode_to_coord(dm) {
    return [dm + 36, 5];
}

function coord_to_dmode(coord) {
    return coord[0] - 36;
}

function draw_pixel_box(ctx, draw, coord) {
    if (coord[0] < 0 || coord[1] < 0)
	return;
    ctx.lineWidth = 2;
    if (draw == 1)
	ctx.strokeStyle = "#000000";
    else if (draw == 2)
	ctx.strokeStyle = "#FF0000";
    else
	ctx.strokeStyle = "#FFFFFF";
    ctx.strokeRect(pxl_size * coord[0] + 2, pxl_size * coord[1] + 2, pxl_size - 4, pxl_size - 4);
}

function draw_canvas() {
    var ctx = can.getContext("2d");
    //ctx.fillStyle = "#FFFFFF";
    //ctx.fillRect(0, 0, 324, 54);
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    for (y = 0; y <= szy; y++) {
	ctx.moveTo(0, y * pxl_size);
	ctx.lineTo(szx * pxl_size, y * pxl_size);
    }
    for (x = 0; x <= szx; x++) {
	ctx.moveTo(x * pxl_size, 0);
	ctx.lineTo(x * pxl_size, szy * pxl_size);
    }
    var ctlctx = ctl.getContext("2d");
    for (x = 0; x < szx; x++) {
	for (y = 0; y < szy; y++) {
	    fill_pixel_box(ctx, make_color(pxls[x][y]), [x, y]);
	    draw_pixel(ctlctx, make_color(pxls[x][y]), [x, y]);
	}
    }
    ctx.stroke();
}

function draw_color_value(clr) {
    var ctx = ctl.getContext("2d");
    ctx.font="12px Courier";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(36 * pxl_size + 2, pxl_size + 2, 56, 16);
    ctx.fillStyle = '#000000';
    ctx.fillText(make_color(clr), 36 * pxl_size + 5, 2 * pxl_size - 5);
}

function set_drawing_color(clr) {
    var ctx = ctl.getContext("2d");
    draw_pixel_box(ctx, 0, clr_coord);
    clr_coord = color_to_coord(clr);
    clr_draw = clr;
    draw_pixel_box(ctx, 1, clr_coord);
}

function set_drawing_mode(dm) {
    var ctx = ctl.getContext("2d");
    draw_pixel_box(ctx, 0, dmd_coord);
    dmd_coord = dmode_to_coord(dm);
    dmode = dm;
    draw_pixel_box(ctx, 1, dmd_coord);
}

function set_coord(event, obj) {
    if (event) {
	var cbr = obj.getBoundingClientRect()
	var ms_x = event.clientX - Math.round(cbr.left);
	var ms_y = event.clientY - Math.round(cbr.top);
	if (ms_x % pxl_size && ms_y % pxl_size)
	{
	    return [Math.floor(ms_x / pxl_size), Math.floor(ms_y / pxl_size)];
	}
    }
    return no_coord;
}

// draws the single pixel in the example image
function draw_pixel(ctx, clr, coord) {
    if (eq(clr, transp_clr))
	ctx.fillStyle = '#FFFFFF';
    else
	ctx.fillStyle = clr;
    ctx.fillRect(coord[0] + 39 * pxl_size + 2, coord[1] + 2, 1, 1);
}

function fill_pixel_box(ctx, clr, coord) {
    if (clr == transp_hex) {
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(pxl_size * coord[0] + 3, pxl_size * coord[1] + 3, pxl_size - 6, pxl_size - 6);
// want to make this prettier later
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(pxl_size * coord[0] + 4, pxl_size * coord[1] + 4);
	ctx.lineTo(pxl_size * coord[0] + pxl_size - 4, pxl_size * coord[1] + pxl_size - 4);
	ctx.moveTo(pxl_size * coord[0] + pxl_size - 4, pxl_size * coord[1] + 4);
	ctx.lineTo(pxl_size * coord[0] + 4, pxl_size * coord[1] + pxl_size - 4);
	ctx.stroke();
    }
    else {
	ctx.fillStyle = clr;
	ctx.fillRect(pxl_size * coord[0] + 3, pxl_size * coord[1] + 3, pxl_size - 6, pxl_size - 6);
    }
}

function set_pixel() {
//dbg.innerHTML += 'set_pixel ' +cur_coord[0]+','+cur_coord[1]+'/'+make_color(clr_draw);
    if (ne(cur_coord, no_coord)) {
//dbg.innerHTML += ' draw ';
	var ctx = can.getContext("2d");
	pxls[cur_coord[0]][cur_coord[1]] = clr_draw;
	fill_pixel_box(ctx, make_color(clr_draw), cur_coord);
	var ctlctx = ctl.getContext("2d");
	draw_pixel(ctlctx, make_color(clr_draw), cur_coord);
    }
}

function can_buttondown(event) {
//dbg.innerHTML = 'can_buttondown ' + dmode;
    can_drawing = 1;
    can_mouse(event);
}

function can_doubleclick(event) {
}

function can_buttonup(event) {
    can_drawing = 0;
}

function can_mouse(event) {
    coord = set_coord(event, can);
    if (ne(coord, cur_coord)) {
	var ctx = can.getContext("2d");
	draw_pixel_box(ctx, 0, cur_coord);
	cur_coord = coord;
	draw_pixel_box(ctx, 2, cur_coord);
	if (coord[0] >= 0 && coord[1] > -1 && coord[0] < szx && coord[1] < szy)
	    draw_color_value(pxls[coord[0]][coord[1]]);
	var ctlctx = ctl.getContext("2d");
	ctlctx.fillStyle = '#FFFFFF';
	ctlctx.fillRect(36 * pxl_size + 2, 2 * pxl_size + 2, 56, 16);
	ctlctx.fillStyle = '#000000';
	ctlctx.fillText(coord[0] + ' x ' + coord[1], 36 * pxl_size + 5, 3 * pxl_size - 5);
    }
    if (event.type == 'mouseleave') {
	can_drawing = 0;
    }
    if (can_drawing) {
	if (dmode == 0)
	    set_pixel();
	else if (dmode == 3) {
	    if (ne(coord, no_coord))
		set_drawing_color(pxls[coord[0]][coord[1]]);
	    set_drawing_mode(0);
	    can_drawing = 0;
	}
	else if (dmode == 5) {
	    if (ne(cur_coord, no_coord)) {
		var clr_match = pxls[cur_coord[0]][cur_coord[1]];
		var ctx = can.getContext("2d");
		for (x = 0; x <= szx; x++) {
		    for (y = 0; y <= szy; y++) {
			if (eq(pxls[x][y], clr_match)) {
			    pxls[x][y] = clr_draw;
			    fill_pixel_box(ctx, make_color(clr_draw), [x, y]);
			    var ctlctx = ctl.getContext("2d");
			    draw_pixel(ctlctx, make_color(clr_draw), [x, y]);
			}
		    }
		}
	    }
	}
    }
}

function can_key(event) {
}

function ctl_buttondown(event) {
    ctl_mouse(event);
    var ctx = ctl.getContext("2d");
    if (ctl_coord[0] >= 36 && ctl_coord[1] == 5) {
	set_drawing_mode(coord_to_dmode(ctl_coord));
    }
    else if (ne(ctl_coord, no_coord) && (ctl_coord[0] < 36 || eq(transp_coord, ctl_coord))) {
	draw_pixel_box(ctx, 0, clr_coord);
	clr_coord = ctl_coord;
	clr_draw = coord_to_color(clr_coord);
	draw_pixel_box(ctx, 1, clr_coord);
    }
}

function ctl_doubleclick(event) {
}

function ctl_buttonup(event) {
}

function ctl_mouse(event) {
    coord = set_coord(event, ctl);
    if (eq(ctl_coord, coord))
	return // cursor hasn't moved
    var ctx = ctl.getContext("2d");
    if (eq(ctl_coord, clr_coord) || eq(ctl_coord, dmd_coord))
	draw_pixel_box(ctx, 1, ctl_coord);
    else
	draw_pixel_box(ctx, 0, ctl_coord);
    ctl_coord = coord;
    if (event.type == 'mouseleave')
	return
    if (eq(coord, no_coord))
	return

    if ((ctl_coord[0] < 36) || (ctl_coord[1] == 5) || eq(ctl_coord, [36, 0])) {
	draw_pixel_box(ctx, 2, ctl_coord);
//dbg.innerHTML = 'can_mouse ' + ctl_coord;
	if (ctl_coord[0] < 36)
	    draw_color_value(coord_to_color(ctl_coord));
    }
}

function ctl_key(event) {
}

function copy_pixels() {
    var pxl;
    pxf.value = '';
    for (y = 0; y < szy; y++) {
	for (x = 0; x < szx; x++) {
	    pxl = pxls[x][y];
	    if (eq(pxl, transp_clr))
		pxf.value += '217 ';
	    else
		pxf.value += (pxl[0] * 36 + pxl[1] * 6 + pxl[2]) + ' ';
	}
    }
}

window.addEventListener("load", tgm_start); // whew!
