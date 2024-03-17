const prompt = document.getElementById("prompt");

document.querySelectorAll(".update").forEach(element => {
    element.addEventListener("click", () => {
        prompt.style.display = "block";
        document.getElementById("yes").innerText = "Update";
        document.getElementById("no").innerText = "Cancel";
        document.getElementById("updated-title").style.display = "block";
        document.getElementById("updated-content").style.display = "block";

        document.getElementById("yes").addEventListener("click", () => {
            let selected = element.parentElement.children;
            let time = (selected[4].children)[1].innerText;
            time = time.slice(7);
            let title = document.getElementById("updated-title").value;
            let content = document.getElementById("updated-content").value;
            fetch("/update", {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ time: time })
            }).then(data => {
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
                    alert("Blog Updated Successfully");
                    window.location.href = '/index';
                })
            })
            document.getElementById("updated-title").style.display = "none";
            document.getElementById("updated-content").style.display = "none";
            prompt.style.display = "none";
        })

        document.getElementById("no").addEventListener("click", () => {
            document.getElementById("updated-title").style.display = "none";
            document.getElementById("updated-content").style.display = "none";
            prompt.style.display = "none";
        })
    })
})

document.querySelectorAll(".delete").forEach(element => {
    element.addEventListener("click", () => {
        prompt.style.display = "block";
        document.getElementById("yes").innerText = "Delete";
        document.getElementById("no").innerText = "Cancel";
        document.getElementById("updated-title").style.display = "none";
        document.getElementById("updated-content").style.display = "none";

        document.getElementById("yes").addEventListener("click", () => {
            let selected = element.parentElement.children;
            let time = (selected[4].children)[1].innerText;
            time = time.slice(7);
            console.log(time);
            fetch("/update", {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ time: time })
            }).then(data => {
                alert("Blog Deleted Successfully");
                window.location.href = '/update';
            })
            prompt.style.display = "none";
        })
        document.getElementById("no").addEventListener("click", () => {
            prompt.style.display = "none";
        })
    })
})