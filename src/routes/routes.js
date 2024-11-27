import express from 'express';
import FindCustomerController from '../app/controllers/FindCustomerController';

const routes = express.Router();

routes.get('/customer', FindCustomerController.findCustomer);

export default routes;