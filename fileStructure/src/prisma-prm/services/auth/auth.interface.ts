interface ICreateUser {
    username: string;
    email: string;
    password: string;
}

interface IUserLogin {
    email: string;
    password: string;
}

export { ICreateUser, IUserLogin };