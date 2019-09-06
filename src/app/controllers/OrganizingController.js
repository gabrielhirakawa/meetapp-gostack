import Meetup from '../models/Meetup';

class OrganizingController {
    async index(req, res) {
        //lista todos meetup do owner logado
        const meetups = await Meetup.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
        });

        return res.json(meetups);
    }
}

export default new OrganizingController();
