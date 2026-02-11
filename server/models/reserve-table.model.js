import { DataTypes } from 'sequelize';

export default (connection) => {
    return connection.define('reservetion_data', {
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        choosenDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numberOfGuest: {
            type: DataTypes.STRING,
            allowNull: false
        },
        occasion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seats: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
};