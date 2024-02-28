import User, { UserAttributes } from "../models/User";

class UserRepositories<T extends keyof UserAttributes> {

    public async findUser(value: UserAttributes[T], field: T) {
        const whereClause: Partial<UserAttributes> = { [field]: value };
        return User.findOne({ where: whereClause });
    }
}

const UsersRepositories = new UserRepositories();
export default UsersRepositories;