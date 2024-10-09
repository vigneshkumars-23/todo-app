export interface TodoObject {
    id: number,
    text: string|undefined,
    isComplete: boolean
};

export interface TodoRequestBody {
    email?: string,
    todos: TodoObject[]
}

export interface UserInfo {
    email: string,
    name: string,
    photo: string,
    todos: TodoObject[]
}

export interface BackendResponse {
    status: number,
    message? : string,
    data: UserInfo
}