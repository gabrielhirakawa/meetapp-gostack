import Meetup from '../models/Meetup';
import Subscription from '../models/Subsctription';
import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import User from '../models/User';

class MeetupController {
    async store(req, res) {
        const schema = Yup.object().shape({
            titulo: Yup.string().required(),
            descricao: Yup.string().required(),
            localizacao: Yup.string().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation fails' });
        }

        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        const { titulo, descricao, localizacao, date } = req.body;
        const meetup = await Meetup.create({
            user_id: req.userId,
            titulo,
            descricao,
            localizacao,
            date,
        });
        console.log('MEETUP criado com sucesso');

        return res.json(meetup);
    } // end store

    async index(req, res) {
        const page = req.query.page || 1;

        //lista todos meetup do usuario logado
        const meetups = await Meetup.findAll({
            attributes: ['id', 'titulo', 'descricao', 'date'],
            order: ['date'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
            limit: 5,
            offset: 5 * page - 5,
        });

        return res.json(meetups);
    } //end index

    async update(req, res) {
        //valida se o usuario logo é organizador do meetup
        const meetup = await Meetup.findByPk(req.params.id);
        if (meetup.user_id !== req.userId) {
            return res.status(401).json({ error: 'not permission' });
        }

        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't update past meetups." });
        }

        //atualiza
        await meetup.update(req.body);
        console.log('MEETUP atualizado com sucesso');

        return res.json(meetup);
    } //end update

    async delete(req, res) {
        const meetup = await Meetup.findByPk(req.params.id);
        if (meetup.user_id !== req.userId) {
            return res.status(401).json({ error: 'not permission' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't delete past meetups." });
        }

        await meetup.destroy();
        return res.json({ status: 'meetup deletado' });
    } //end delete
}

export default new MeetupController();
