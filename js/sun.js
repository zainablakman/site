/*DAY AND NIGHT MODE DESIGN CHANGES*/

function lightUp() {
	if (document.getElementById('orb').className === "night") {
		document.getElementById('orb').className = "day";
		document.getElementsByClassName('sun')[0].hidden = false;
		document.getElementsByClassName('sun')[0].style.top = "30px";
		document.getElementsByClassName('moon')[0].style.top = "2500px";
		document.getElementsByClassName('header')[0].style.backgroundColor = "#9BCAFE";
		document.getElementsByClassName('content')[0].style.backgroundColor = "#9BCAFE";
		let el = document.getElementsByClassName('show');
			for (let i=0;i<el.length; i++) {
   		 	el[i].style.backgroundColor = "rgba(0, 0, 0, 0.3)";
		}
		document.documentElement.style.backgroundColor = "#9BCAFE";
	}
	else if (document.getElementById('orb').className === "day")
	{
		document.getElementById('orb').className = "night";
		document.getElementsByClassName('sun')[0].style.top = "2200px";
		document.getElementsByClassName('moon')[0].style.top = "30px";
		document.getElementsByClassName('header')[0].style.backgroundColor = "#22204F";
		document.getElementById('content').style.backgroundColor = "#22204F";
		document.documentElement.style.backgroundColor = "#22204F";
		let el = document.getElementsByClassName('show');
			for (let i=0;i<el.length; i++) {
   		 	el[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
		}
	}
}