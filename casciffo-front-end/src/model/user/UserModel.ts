interface UserModel {
    userId?: string
    name: string,
    email: string,
    roleId?: number,
    role?: UserModel
}

export default UserModel