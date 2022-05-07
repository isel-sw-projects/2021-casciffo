interface UserModel {
    id?: string
    name: string,
    roleId?: number,
    role?: UserModel
}

export default UserModel