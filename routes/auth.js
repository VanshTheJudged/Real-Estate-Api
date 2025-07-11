//The route is the address or URL where the request comes in.
import express from 'express';
//object destructuring
// import {api , login} from '../controllers/auth.js';
import * as auth from '../controllers/auth.js';
import { requireSignin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth.api);
//route is like a place which tells if someone comes to this address what should it get or go next.
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.get('/current-user', requireSignin, auth.currentUser);
router.put('/update-password', requireSignin, auth.updatePassword);
router.put('/update-username', requireSignin, auth.updateUsername);
//update-password


export default router;