import jsonCustomer from '../database/customer.json';

class findCustumerController {
    async findCustomer(req, res) {
        try{
            let data = jsonCustomer;

            res.status(200).json({
                success: true,
                data: jsonCustomer
            })
        }catch(err){
            res.status(500).json({
                success: false,
                message: "Ocorreu um erro"
            })
        }
    }
}

export default new findCustumerController();