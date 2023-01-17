let li = document.getElementById('todo').children
let mySearch = document.getElementById('mySearch');
let mySort = document.getElementById('tri');

document.addEventListener('keydown', (e) => {
	if (e.key === 'a') {
		let bModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
		bModal.show();
	}
});

mySearch.addEventListener('keyup', () => {
	for (i = 0; i < li.length; i++) {
		if (li[i].children[1].children[0].value.includes(mySearch.value))
			li[i].style.display = "";
		else
			li[i].style.display = "none";
	}
});

mySort.addEventListener('change', () => {
	for (i = 0; i < li.length; i++) {
		if (li[i].children[1].children[0].style.color === mySort.value || mySort.value === 'all')
			li[i].style.display = "";
		else
			li[i].style.display = "none";
	}
});



document.getElementById("submit").addEventListener('click', submit);
document.getElementById('myTask').addEventListener('keydown', (e) => {
	if (e.key === "Enter") {
		submit();
		document.getElementById('close').click();
	}
});

function submit() {
	let value = document.getElementById('myTask').value;

	if (value != "") {
		let li = document.createElement('li');
		let label = Math.floor(Math.random()*1000);
		li.innerHTML = "<input type='checkbox' class='checkbox' label=" + label + "><label for="+ label +">" + "<input type='text'>" + "</label><button>Edit</button><span>&times;</span>";
		li.setAttribute("class", "dragItem");
		li.children[1].children[0].value = value;
		li.children[1].children[0].setAttribute("readonly", "readonly");
		li.children[1].children[0].style.color = document.getElementById('select').value;
		
		document.getElementById('todo').appendChild(li);
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
		// Array.from(document.getElementsByClassName("dragItem")).forEach(item => {
		// 	item.addEventListener('mousedown', mouseDownHandler);
		// });
	}
}

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

	if(prevElem && isAbove(dragElem, prevElem)) {
		swap(placeholder, dragElem);
		swap(placeholder, prevElem);
	}

	if(nextElem && isAbove(nextElem, dragElem)) {
		swap(nextElem, placeholder);
		swap(nextElem, dragElem);
	}

	dragElem.style.position = "absolute";
	dragElem.style.top = (e.pageY - y) + 'px';
	dragElem.style.left = (e.pageX - x) + 'px';
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