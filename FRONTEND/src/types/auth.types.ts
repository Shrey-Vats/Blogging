export interface signUpType  {
    name: string,
    email: string,
    password: string
}

export interface signInType {
    email : string,
    password: string
}

export interface User {
  id: string;
  name: string;
  email: string;
}