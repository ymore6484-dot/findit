function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.text())
        .then(data => {
            if (data === "Success") {
                localStorage.setItem("userEmail", email);
                window.location.href = "dashboard.html";
            } else document.getElementById("msg").innerText = "Invalid Login";
        });
}

function register() {
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.text())
        .then(data => {
            alert(data);
        });
}