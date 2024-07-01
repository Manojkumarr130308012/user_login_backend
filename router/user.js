const router = require('express').Router();
const userController = require('./../controller/user');

router.post('/add', async (req, res) => {
    res.send(await userController.add(req.body));
});

router.get('/users', async (req, res) => {
    res.send(await userController.fetch());
});

router.get('/fetchlusers', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const response = await userController.fetchdata(req.query.id);
	res.send(response);
});

router.delete('/delete', async (req, res) => {
	const response = await userController.delete(req.query.id);
	res.send(response);
});

router.put('/update', async (req, res) => {
	const response = await userController.update(req.query.id, req.body);
	res.send(response);
})

module.exports = router;