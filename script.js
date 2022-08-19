let li = document.getElementById(document.getElementById('column').value).children
let mySearch = document.getElementById('mySearch');
let mySort = document.getElementById('tri');
let array = [];
function keyAPress(e) {
	if (e.key === 'a') {
		document.getElementById('addClass').click();
		document.removeEventListener('keydown', keyAPress);
	}
}

document.addEventListener('keydown', keyAPress);

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape')
	document.addEventListener('keydown', keyAPress);
});

document.getElementById('close').addEventListener('click', () => {document.addEventListener('keydown', keyAPress);});

mySearch.addEventListener('keyup', () => {
	for(let i = 0; i < array.length; i++) {
		if(array[i].children[1].children[0].value.toLowerCase().includes(mySearch.value.toLowerCase())) {
			array[i].style.display = "block";
		} else {
			array[i].style.display = "none";
		}
	}
});

mySort.addEventListener('change', () => {
	for (i = 0; i < li.length; i++) {
		if (array[i].children[1].children[0].style.color === mySort.value || mySort.value === 'all')
			array[i].style.display = "";
		else
			array[i].style.display = "none";
	}
});

function submit() { // POUR AVOIR UNE PORTEE GLOBALE
	let value = document.getElementById('myTask').value;

	if (value != "") {
		let li = document.createElement('li');
		let label = Math.floor(Math.random()*1000);
		li.innerHTML = "<input type='checkbox' class='checkbox' label=" + label + "><label for="+ label +">" + "<input type='text' class='inputLi'>" + "</label><button class='editButton'>Edit</button><span class='closeLi'>&times;</span>";
		li.setAttribute("class", "dragItem");
		li.children[1].children[0].value = value;
		li.children[1].children[0].setAttribute("readonly", "readonly");
		li.children[1].children[0].style.color = document.getElementById('select').value;
		document.getElementById(document.getElementById('column').value).appendChild(li);

		array.push(li); // LES ELEMENTS SONT MAINTENANT STOCKER ICI

		document.getElementById('myTask').value = "";

		li.children[0].addEventListener('change', (e) => {
			e.stopPropagation();
			li.children[1].children[0].classList.toggle("lineThrough");
		});

		li.lastChild.addEventListener('click', (e) => {
			e.stopPropagation();
			li.remove();
		});

		li.children[2].addEventListener('click', (e) => {
			e.stopPropagation();
			li.children[1].children[0].toggleAttribute("readonly");
			li.children[1].children[0].focus();
		});

		li.children[1].children[0].addEventListener('keydown', (e) => {
			if (e.key === "Enter")
				li.children[1].children[0].setAttribute("readonly", "readonly");
		});
		li.addEventListener('mousedown', mouseDownHandler);
		document.addEventListener('keydown', keyAPress);
		// Array.from(document.getElementsByClassName("dragItem")).forEach(item => {
		// 	item.addEventListener('mousedown', mouseDownHandler);
		// });
	}
}

document.getElementById("submit").addEventListener('click', submit);

document.getElementById('myTask').addEventListener('keyup', (e) => {
	if (e.key === "Enter") {
		submit();
		var button = document.getElementById('close');
		button.click();
		console.log(typeof button);
	}
});

let x = 0;
let y = 0;
let placeholder;
let dragStart = false;
let dragElem;

function isAbove(nodeA, nodeB) {
	const rectA = nodeA.getBoundingClientRect();
	const rectB = nodeB.getBoundingClientRect();

	return (rectA.top + rectA.height) / 2 < (rectB.top + rectB.height) / 2
}

function swap(nodeA, nodeB) {
	const parentA = nodeA.parentNode;
	const siblingA = (nodeA.nextSibling === nodeB) ? nodeA: nodeA.nextSibling;

	nodeB.parentNode.insertBefore(nodeA, nodeB);
	parentA.insertBefore(nodeB, siblingA);
}

const mouseDownHandler = function (e) {
	e.stopPropagation();
	dragElem = e.target;
	while (dragElem.localName != "li")
		dragElem = dragElem.parentNode;

	const rect = dragElem.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;
	

	//e.stopPropagation();
	document.addEventListener('mousemove', mouseMouveHandler);
	document.addEventListener('mouseup', mouseUpHandler);
	


}

const mouseMouveHandler = function (e) {
	const rect = dragElem.getBoundingClientRect();
	const prevElem = dragElem.previousElementSibling;
	const nextElem = dragElem.nextElementSibling;
	e.stopPropagation();

	if (!dragStart) {
		dragStart  = true;

		placeholder = document.createElement("div");
		placeholder.classList.add('placeholder');
		dragElem.before(placeholder);
	}

	placeholder.style.height = rect.height + "px";
	placeholder.style.width = " 100px!important";

	if(prevElem && isAbove(dragElem, prevElem)) {
		swap(placeholder, dragElem);
		swap(placeholder, prevElem);
	}

	if(nextElem && isAbove(nextElem, dragElem)) {
		swap(nextElem, placeholder);
		swap(nextElem, dragElem);
	}
	dragElem.style.position = "absolute";
	console.log(dragElem.style.width);


	let week = document.getElementById("week");
	var otherY = week.offsetTop;// other div x position
	console.log("autre bloc : " + otherY);
	dragElem.style.top = (e.pageY - y) + 'px';
	dragElem.style.left = (e.pageX - x) + 'px';
	console.log("mon bloc : " + dragElem.style.top);

	if (parseInt(dragElem.style.top) >= otherY ) {
	  console.log("collision");
	}


}

const mouseUpHandler = function() {
	dragElem.style.removeProperty('top');
    dragElem.style.removeProperty('left');
    dragElem.style.removeProperty('position');

	placeholder.remove();
	dragStart = false;

    x = null;
    y = null;
    dragElem = null;

	document.removeEventListener('mousemove', mouseMouveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
}