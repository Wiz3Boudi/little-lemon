import { DataTypes } from 'sequelize';
import { hash } from 'bcryptjs'

export default (connection) => {
    const User = connection.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    User.beforeSave(async (user) => {
        if (user.changed('password')) {
            user.password = await hash(user.password, 10);
        }
    })
    return User ;
}