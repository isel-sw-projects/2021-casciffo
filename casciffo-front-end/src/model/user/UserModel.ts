type Roles = {
    id: string,
    name: string
}

interface UserModel {
    userId ?: string,
    name?: string,
    email?: string,
    password?: string,
    roles?: Roles[],
}

export default UserModel