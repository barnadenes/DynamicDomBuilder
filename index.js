const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let loadButtonEl;
let albumsDivEl;
let albumContDivEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        const postId = post.id;
        strongEl.setAttribute('post-id', postId);
        strongEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', postId)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    albumContDivEl.style.display = 'none';

    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createCommentsList(comments) {
    const ulEl = document.createElement('ul');
    const h2El = document.createElement('h2');
    h2El.textContent = 'Comments \n'
    ulEl.appendChild(h2El);
    ulEl.classList.add('comments');

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = comment.title;

        const pEl = document.createElement('p');
        pEl.appendChild(document.createTextNode(`: ${comment.body}`));

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(strongEl);
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function onCommentsReceived() {
    const text = this.responseText;
    const comments = JSON.parse(text);
    const postId = comments[0].postId;
    const ulEl = document.getElementsByClassName('comments');

    for (let i = 0; i < ulEl.length; i++) {
        const comment = ulEl[i];
        if(comment.getAttribute('id') != postId) {
            comment.remove();
        }
    }

    const divEl = document.getElementById(postId);
    if (divEl.childNodes.length <= 1) {
        divEl.appendChild(createCommentsList(comments));
    }
}

function onLoadComments() {
    const el = this;
    const postId = el.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function createPhotosList(photos) {
    const ulEl = document.createElement('ul');
    const h2El = document.createElement('h2');
    h2El.textContent = 'Photos \n'
    ulEl.appendChild(h2El);
    ulEl.classList.add('photos');

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        ulEl.setAttribute('id', photo.albumId);

        // creating paragraph
        const aEl = document.createElement('a');
        aEl.setAttribute('href', photo.url);
        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', photo.thumbnailUrl);
        aEl.appendChild(imgEl);
        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(aEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPhotosReceived() {
    const text = this.responseText;
    const photos = JSON.parse(text);

    const albumId = photos[0].albumId;
    const ulEl = document.getElementsByClassName('photos');

    for (let i = 0; i < ulEl.length; i++) {
        const photo = ulEl[i];
        if(photo.getAttribute('id') != albumId) {
            photo.remove();
        }
    }

    const divEl = document.getElementById(albumId);
    if (divEl.childNodes.length <= 1) {
        divEl.appendChild(createPhotosList(photos));
    }
}

function onLoadPhotos() {
    const el = this;
    const postId = el.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPhotosReceived);
    xhr.open('GET', BASE_URL + '/photos?albumId=' + postId);
    xhr.send();
}

 // -2 album table body creation 

function createAlbumsTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-userAlbum-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

 // -1 table header az albumoknak

function createAlbumsTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

// 0  create table


function createAlbumsTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createAlbumsTableHeader());
    tableEl.appendChild(createAlbumsTableBody(users));
    return tableEl;
}

// 1 megcsinálja az album listát ha rákattolsz a névre!!!!!!!!


function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        // creating paragraph
        const pEl = document.createElement('p');

        const postId = album.id;
        pEl.setAttribute('post-id', postId);
        pEl.textContent = album.title;
        pEl.addEventListener('click', onLoadPhotos);

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', postId)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

// 2 ha kattintasz 1 linkre, megjeleníti az albumot user id alapján 

function onLoadAlbums() {
    postsDivEl.style.display = 'none';

    const el = this;
    const userId = el.getAttribute('data-userAlbum-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

// 3  beolvassa a response textet és átadja a create listának ill. törli a fölös diveket.

function onAlbumsReceived() {
    albumContDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('album-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    const cDivEl = document.getElementById('albums-content');
    divEl.appendChild(createUsersTable(users));
    cDivEl.appendChild(createAlbumsTable(users));
}

function onLoadUsers() {    
    albumsDivEl.style.display = 'block';

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}


document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    albumsDivEl = document.getElementById('albums');
    albumContDivEl = document.getElementById('album-container')
    loadButtonEl.addEventListener('click', onLoadUsers);
});