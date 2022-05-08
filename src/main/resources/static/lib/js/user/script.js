/* 레이어 열고 시작  */
function fnShow(obj) {
	if (document.getElementById(obj).style.display == "none") {
		document.getElementById(obj).style.display = ""
	} else {
		document.getElementById(obj).style.display = "none"
	}
	/* 
	var obj_r = document.getElementById('rTag');
	var obj_c = document.getElementById('cTag');
	var obj_l = document.getElementById('lTag');
	obj_l.style.height = null;
	obj_c.style.height = null;
	if(eval(obj_r)) {obj_r.style.height = null;}
	cTagreSize(); */
}

function hidden_layer(layer_name)
{
if (layer_name == '') return;
eval(layer_name+".style.display='none'")
}

function show_layer(layer_name)
{
if (layer_name == '') return;
eval(layer_name+".style.display='block'")
}
/* 레이어 열고 닫기 끝 */
