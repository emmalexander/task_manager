import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const userRoute = Router();
// Path: api/v1/user/ (GET)
userRoute.get('/', getUsers);
// Path: api/v1/user/:id (GET)
userRoute.get('/:id', authorize, getUser);
userRoute.post('/', (req, res) => res.send({ title: 'CREATE new user' }));
userRoute.put('/:id', (req, res) => res.send({ title: 'UPDATE a user' }));
userRoute.delete('/:id', (req, res) => res.send({ title: 'DELETE a user' }));
export default userRoute;
//# sourceMappingURL=user.routes.js.map