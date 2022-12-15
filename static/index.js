function login(event){
    event.preventDefault();
    const Id = loginForm_login.querySelector('#nick').value;
    const password = loginForm_login.querySelector('#password').value;
    const loginUserDto = {
        Id, 
        password
    } 
    
    socket.emit("login", loginUserDto);
}

function gosignupFrom(event){
    event.preventDefault();
    $('#loginPage').hide();
    $('#signupPage').show();
    // document.getElementById("loginPage").style.display = 'none';
    // document.getElementById("signupPage").style.display = 'block';

}

function notlogin(event){
    event.preventDefault();
    // document.getElementById("loginPage").style.display = 'none';
    // document.getElementById("welcome").style.display = 'block';
    $('#loginPage').hide();
    $('#welcome').show();
}
