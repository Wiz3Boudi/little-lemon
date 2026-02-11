import { DataTypes } from 'sequelize';
export default (connection) => {
    return connection.define('Logo', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        URL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        updatedAt: false,
        createdAt: false,
        freezeTableName: true,
    })
}