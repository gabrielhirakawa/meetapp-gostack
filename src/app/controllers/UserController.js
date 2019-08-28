import User from '../models/User';

class UserController {
    async store(req, res) {
        const UserExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (UserExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const { id, name, email } = await User.create(req.body);
        console.log('criado com sucesso');
        return res.json({ id, name, email });
    }
    async update(req, res) {
        const { email, oldPassword } = req.body;
        const user = await User.findByPk(req.userId);

        if (email != user.email) {
            const UserExists = await User.findOne({ where: { email } });
            if (UserExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'password does not match' });
        }

        //se passar todas verify, faz o update e retorna info
        const { id, name, provider } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }
}

export default new UserController();
