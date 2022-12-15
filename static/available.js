function id_value(Id){
    // id 유효성 검사
    if (Id == "") {
        alert("Please check your ID!");
        $("#sign_nick").focus();
        return false;
    }

    var idRegExp = /^[a-zA-z0-9]{4,12}$/; 
    if (!idRegExp.test(Id)) {
        alert("ID must be entered in uppercase and lowercase letters and 4 to 12 numbers!");
        $("#sign_nick").focus();
        return false;
    }
    return true;
}

function pwd_value(password,confirm){
    var reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    if (password == "") {
        alert("Please check your password !");
        $("#sign_password").focus();
        return false;
    }

    if (confirm == "") {
        alert("Please check your confirm password !");
        $("#sign_confirmPassword").focus();
        return false;
    }

    if(!reg.test(password) ) {
        alert("Password must contain at least 8 letters, numbers and one special character!");
        return false;
    }

    if (password != confirm) {
        alert("Passwords do not match !");
        $("#sign_password").focus();
        return false;
    }

    return true ;
}