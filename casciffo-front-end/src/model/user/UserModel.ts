type Roles = {
    id: string,
    name: string
}

interface UserModel {
    userId?: string
    userName?: string,
    userEmail: string,
    userPassword?: string,
    roles?: Roles[],
}

export default UserModel