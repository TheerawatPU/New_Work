import express from 'express';
import {
    getuser,
    adduser,
    updateuser,
    deleteUserAll,
    getUserByID,
    SearchUserEmail,
    searchUser,
    getAmountmost3user
} from '../controllers/User';
const root = express.Router();

root.get('/user', getuser);
root.post('/user', adduser);
root.put('/user', updateuser);
root.delete('/user', deleteUserAll);
root.get('/UserID', getUserByID);
root.get('/SearchUserEmail', SearchUserEmail);
root.get('/searchUser', searchUser);
root.get('/amount3User', getAmountmost3user);

export default root;
