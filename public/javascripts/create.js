document.getElementById("upload").addEventListener("click", ()=>{
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const date = new Date();
    
    const blog = {
        title: title,
        content: content,
        date: date
    };

    fetch('/create', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(blog)
    }).then(data => {
        alert("Blog Uploaded Successfully");
        window.location.href = '/index';
    })
});