findHighestPostId();
loadMyBlog();

window.addEventListener("click", clicked);

<!--WHEN FORM IS NOT SUMBITTED AND CLICK EVENT RESET-->
function clicked() {
	if (event.target.id === 'admin' || event.target.id === 'editing-mode-button') {
		document.getElementById('form').reset();
	}
}

<!--ONLY ALLOW TO ADD WHEN TITLE AND CONTENT IS FILLED OUT -->
function enableAddButton() {
	if ((document.getElementById('blog-title').value !== "") 
		&& (document.getElementById('blog-content').value !== ""))
	{
		document.getElementById('add').removeAttribute('disabled');
	}
	else if ((document.getElementById('blog-title').value == "") 
		|| (document.getElementById('blog-content').value == ""))
	{
		document.getElementById('add').setAttribute('disabled', true);
	}
}

<!--LOADING BLOG FROM FIREBASE-->
function loadMyBlog() {
	let posts = firebase.database().ref('posts/');
	posts.on('child_added', function(snapshot) {
	let newPost = snapshot.val();
	let div = document.createElement('div');
	div.className = 'blog-post';
	div.id = newPost.postID;
	document.getElementById('content').appendChild(div);
	let innerH2 = document.createElement('h2');
	innerH2.className = 'post-title';
	innerH2.innerHTML = newPost.title;
	innerH2.id = newPost.postID + "-title";
	let innerH3 = document.createElement('h3');
	innerH3.innerHTML = "Posted: " + newPost.posted;
	innerH3.className = "posted";
	let innerP = document.createElement('p');
	innerP.className = 'post-content';
	innerP.innerHTML = newPost.content;
	innerP.id = newPost.postID + "-content";
	let innerHR = document.createElement('div');
	innerHR.className = 'wave';
	div.appendChild(innerH2);
	div.appendChild(innerH3);
	div.appendChild(innerP);
	div.appendChild(innerHR);
	setTimeout(function() {
    div.className = div.className + " show";
  	}, 10);
	});
}

<!--ADDING POSTED DATE TO POST -->
function date() {
	let d = new Date(); 
	return d.toLocaleString();
}

<!--FIND HIGHEST ID ON FIREBASE POSTS AND ASSIGN THAT TO COUNTER -->
function findHighestPostId() {
	let posts = firebase.database().ref('posts/').orderByValue().limitToLast(1);
	counter = 0;
	posts.on('child_added', function(snapshot) {
	let postContent = snapshot.val();
	let postContents = postContent.postID;
	let splitByDash = postContents.split('-');
	counter = splitByDash[1];
	return counter;
	});
}

<!--UNIQUEID WITH CREATED COUNTER-->
function uniqueId() {
    return 'postId-' + ++counter;
}

<!--ADDING NEW BLOG POST-->
function writeUserData(title, content, postID, posted) {
	document.getElementById('form').addEventListener("click", function(event) {
		event.preventDefault();
	});
  	firebase.database().ref('posts/' + postID).set({
    title: title,
    content: content,
    postID: postID,
    posted: posted
  	});
  	document.getElementById('form').reset();
  	document.getElementById('add').setAttribute('disabled', true);
  	if (document.getElementById('orb').className === "day") {
  		document.getElementById(postID).style = "background-color: rgba(0, 0, 0, 0.3)";
  	}
}

<!--OPENING ADMIN INTERFACE-->
function openOrCloseAdmin() {
	document.getElementById('admin-form').classList.toggle('admin-form-hidden');
}

<!--ENTER EDITING MODE-->
function enterEditingMode() {
	document.getElementById('add').setAttribute('disabled', true);
	if (document.getElementById('editing-mode-button').innerHTML === "Exit editing mode") {
		exitEditingMode();
	}
	else {
		//document.getElementsByClassName('admin-help-editing-hidden')[0].classList.toggle('admin-help-editing');
	let button = document.getElementById('editing-mode-button');
	let addButton = document.getElementById('add');
		addButton.setAttribute("hidden", true);
		button.innerHTML = "Exit editing mode";
		const parentObject = document.getElementsByClassName('blog-post');
		[...parentObject].forEach((parent, i) => {
			let addEditButton = document.createElement('button');
			let addDeleteButton = document.createElement('button');
			addEditButton.innerHTML = "Select";
			addDeleteButton.innerHTML = "Delete";
			addEditButton.className = "edit-button btn btn-outline-info";
			addDeleteButton.className = "delete-button btn btn-outline-info";
			parent.appendChild(addEditButton);
			parent.appendChild(addDeleteButton);
			addDeleteButton.id = addDeleteButton.parentNode.id + "-delete";
			addEditButton.id = addEditButton.parentNode.id + "-edit";
			addDeleteButton.addEventListener("click", this.onDeleteButton.bind(this), false); 
			addEditButton.addEventListener("click", this.onEditButton.bind(this), false);
			})
	}
}

<!--EXIT EDITING MODE-->
function exitEditingMode() {
		let button = document.getElementById('editing-mode-button');
		button.innerHTML = "Exit editing mode";
		let addButton = document.getElementById('add');
		addButton.removeAttribute("hidden");
		let editButton = document.getElementById('edit');
		editButton.setAttribute("hidden", true);
		while (document.getElementsByClassName('edit-button')[0]) {
        document.getElementsByClassName('edit-button')[0].remove();
    	}
    	while (document.getElementsByClassName('delete-button')[0]) {
        document.getElementsByClassName('delete-button')[0].remove();
		}
		document.getElementById('editing-mode-button').innerHTML = "Editing mode";
}

<!--DELETE BLOG POST -->
function onDeleteButton(event) {
	event.preventDefault();
	let id = event.target.parentElement.getAttribute('id');
	let deletePost = document.getElementById(id);
	firebase.database().ref('posts/' + id).remove().then(function() {
    	console.log("Remove succeeded.")
  	})
  	.catch(function(error) {
   	 console.log("Remove failed: " + error.message)
  	});
	deletePost.className = deletePost.className + " hide";
	document.getElementById('blog-title').value = "";
	document.getElementById('blog-content').value = "";
	document.getElementById('edit').setAttribute('disabled', true);
	setTimeout(function () { deletePost.parentNode.removeChild(deletePost); }, 1500);
}

<!--SELECT WHICH POST TO EDIT-->
function onEditButton(event) { 
	event.preventDefault();
	let editButton = document.getElementById('edit');
	editButton.removeAttribute("hidden");
	editButton.removeAttribute("disabled");
	let id = event.target.parentElement.getAttribute('id');
	let posts = firebase.database().ref('posts/' + id);
	let storeTitle = document.getElementById('blog-title');
	let storeContent = document.getElementById('blog-content');
	localStorage.setItem("postID", id);
    document.getElementById("blog-id-storage").innerHTML = localStorage.getItem("postID");
	posts.once('value', function(snapshot) {
	let editPost = snapshot.val();
	storeTitle.value = editPost.title;
	storeContent.value = editPost.content;
	});
}

<!--SAVE EDITED POST CHANGES -->
function saveChanges(event) {
	event.preventDefault();
	let modifiedTitle = document.getElementById('blog-title').value;
	let modifiedContent = document.getElementById('blog-content').value;
	let modifiedId = document.getElementById('blog-id-storage').innerHTML;
	let postData = {
		title: modifiedTitle,
		content: modifiedContent
	};
	firebase.database().ref().child('posts').child(modifiedId).update(postData);
	document.getElementById(modifiedId + '-title').innerHTML = postData.title;
	document.getElementById(modifiedId + '-content').innerHTML = postData.content;
	document.getElementById('blog-title').value = "";
	document.getElementById('blog-content').value = "";
	document.getElementById('blog-id-storage').innerHTML = "";
	document.getElementById('edit').setAttribute('disabled', true);
}