function ShowModal(text)
{
	ismodal = true;
	var modal = document.querySelector(".modal");
	document.getElementById("modaltext").innerHTML=text;
	modal.style.display="block";
	modal.focus();
}
function CloseModal()
{
	document.querySelector(".modal").style.display="none";
	ismodal = false;
}