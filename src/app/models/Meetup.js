import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetup extends Model {
    static init(sequelize) {
        super.init(
            {
                titulo: Sequelize.STRING,
                descricao: Sequelize.STRING,
                localizacao: Sequelize.STRING,
                date: Sequelize.DATE,
                user_id: Sequelize.INTEGER,
                past: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return isBefore(this.date, new Date());
                    },
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }
    static associate(models) {
        this.hasMany(models.Subscription, {
            foreignKey: 'meetup_id',
            as: 'meetup',
        });
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

export default Meetup;
