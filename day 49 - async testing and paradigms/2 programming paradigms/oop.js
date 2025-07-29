// In the object oriented approach we can create classes for various entities like the form, the user, etc
// We can work with classes or constructor functions because classes are just syntactic sugar here
// Let's define the different classes first
class Validator {
    static REQUIRED = 'REQUIRED';
    static MIN_LENGTH = 'MIN_LENGTH';
    static validate(value, flag, threshold) {
        // if (uname.trim().length > 0 && pass.trim().length > 5) {
        //     return true;
        // }
        // return false;

        // Instead of doing my way, I'll follow the course which instructs to use a flag parameter for reusability
        // which means we take a value, which we can define as static literals here that can be accessed while called
        // And we can validate the username and passwords separately
        if (flag === this.REQUIRED) {
            return value.trim().length > 0;
        }
        if (flag === this.MIN_LENGTH) {
            return value.trim().length > threshold;
        }
    }
}

class User {
    constructor(uname, password) {
        this.uname = uname;
        this.password = password;
    }

    // We can add a constructor function for greeting
    greet() {
        console.log(`Hi I am ${this.uname}, nice to meet you!`);
    }
}

class UserInputForm {
    // We can now store the variables from procedural as properties of this class
    constructor() {
        this.form = document.getElementById('user-input');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');

        // Now we need to add an event listener in which case we will call a handler method in this class
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        // We should not forget to bind this here because we're calling this inside an event listener
    }

    submitHandler(event) {
        // We then do what we did in procedural, prevent default behavior, get the inputs from the input fields, etc
        event.preventDefault();
        const usernameEntered = this.usernameInput.value;
        const passwordEntered = this.passwordInput.value;

        // But since our validation may differ when this class may be reused somewhere else, we can seprate it into another class
        // We can then call a static function from that class so that we don't have to instantiate it
        // if (Validator.validate(usernameEntered, passwordEntered)) {
        // }
        if (
            !Validator.validate(usernameEntered, Validator.REQUIRED) ||
            !Validator.validate(passwordEntered, Validator.MIN_LENGTH, 5)
        ) {
            alert(
                'Username or password is incorrect. (Passwords must be longer than 5 characters.'
            );
            return;
        }

        // And if we're successful, we should create a new user, so we can use a User class here to store the properties of the user
        const newUser = new User(usernameEntered, passwordEntered);
        console.log(newUser);
        newUser.greet();
    }
}

// but since all of these are simply defined, we need to instantiate the form first because that is what uses the rest of the classes
new UserInputForm();
