import { Router } from "express";
import * as controllers from "../controllers/index.controller.js";
import isAuthenticated from '../middelwares/isAuthenticated.js';

const router = Router();
router.get('/', controllers.homePage);
router.get('/home', controllers.homePage);

router.route('/reservation')
    .get(isAuthenticated,controllers.reserveTabale)
    .post(isAuthenticated, controllers.receiveTableReservtionInfo);

export default router;
