import { DataTypes } from "sequelize";

export default (connection) => {
    return connection.define('Testimony', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        evaluationText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        evaluationStars: {
            type: DataTypes.STRING,
            allowNull: false
        },
        URL: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        updatedAt: false,
        createdAt: false,
        timestamps: false
    })
}