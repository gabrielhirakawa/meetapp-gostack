import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subsctription';
import { isBefore } from 'date-fns';
import Mail from '../../lib/Mail';

class SubscriptionController {
    async store(req, res) {
        const meetup = await Meetup.findByPk(req.params.id);
        const user = await User.findByPk(req.userId);

        // verifica se o usuario logado não esta tentando entrar no proprio meetup
        if (meetup.user_id === req.userId) {
            return res.json({ error: 'you cant enter on your meetup ' });
        }

        // verifica se a data ja nao passou
        if (meetup.past) {
            return res
                .status(400)
                .json({ error: 'meetup is already happened' });
        }
        console.log('chegou aq');
        // verificar se ja nao tem outro meetup no mesmo dia
        const checkDate = await Subscription.findOne({
            where: {
                user_id: req.userId,
            },
            include: [
                {
                    model: Meetup,
                    as: 'meetup',
                    required: true,
                    where: {
                        date: meetup.date,
                    },
                },
            ],
        });

        if (checkDate) {
            return res.status(400).json({
                error: "Can't subscribe to two meetups at the same time",
            });
        }

        // insere no banco
        const subscription = await Subscription.create({
            user_id: req.userId,
            meetup_id: meetup.id,
        });

        await Mail.sendMail({
            to: `${user.name} <${user.email}>`,
            subject: 'Novo inscrito no meetup',
            text: 'meetup recebeu um novo inscrito',
        });
        return res.json(subscription);
    }

    async index(req, res) {
        //lista todos meetup do usuario logado
        const meetups = await Subscription.findAll({
            where: { user_id: req.userId },
            attributes: ['meetup_id'],
            include: [
                {
                    model: Meetup,
                    as: 'meetup',
                    attributes: ['titulo', 'descricao', 'date'],
                    order: ['date'],
                },
            ],
        });

        return res.json(meetups);
    }
}

export default new SubscriptionController();
