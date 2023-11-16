import express, { request, response } from 'express' // EMCS6
const router = express.Router();

router.get('/', (request, response) => response.render("layout/index.pug", { page: "Home" }))

router.post('/', (req, res) => res.send("Hi web from POST verb."))
router.put('/', (req, res) => res.send("You're trying to update all data object through PUT."))
router.patch('/', (req, res) => res.send("Hi, you're trying to update all data object through PATCH."))
router.delete('/', (req, res) => res.send("Are you sure that you want to DELETE Data?"))

export default router;