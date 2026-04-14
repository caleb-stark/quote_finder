let author_links = document.querySelectorAll('.author');
for (let link of author_links){
    link.addEventListener('click', async function(e){
        var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
        myModal.show();
        let url = `/api/authors/${e.currentTarget.id}`;
        let response = await fetch(url);
        let data = await response.json();
        let author_info = document.querySelector('#author-info');
        author_info.innerHTML = `<h1>${data[0].firstName} ${data[0].lastName}</h1>`;
        author_info.innerHTML += `<img src="${data[0].portrait}" width="200"><br><br>`;
        author_info.innerHTML += `<p>${data[0].biography}</p>`;
    });
}  

document.querySelector('#key-input').addEventListener('input', function(){
    let keyword = document.querySelector('#key-input').value;
    if (keyword.length < 3){
        document.querySelector('#warning').style.display = 'block';
    }
    else {
        document.querySelector('#warning').style.display = 'none';
    }
});