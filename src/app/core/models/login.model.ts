export{ LoginResponse, Data, UserData, User};

interface LoginResponse{
    status: string;
    message: string;
    data: Data;
}

interface Data{
    data: UserData;
}

interface UserData{
    user: User;
}

interface User{
    id: number;
    name: string;
    lastname: string;
    biography: string;
    username: string;
    token: string;
}