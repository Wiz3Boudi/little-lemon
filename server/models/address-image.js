import { DataTypes } from "sequelize";

export default (connection) => {
    return connection.define('location', {
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        URL1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        URL2: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        updatedAt: false,
        createdAt: false,
        timestamps: false
    })
}