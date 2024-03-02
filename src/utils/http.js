import axios from 'axios'
import Config from '../config'
import { Message } from 'element-ui'
class HTTP{
    static async request({url, data, method, params}){
        let res
        try{
            res = await axios({
                url: Config.localURL + url,
                data: data,
                method: method,
                params: params,
                headers: {
                    'token': localStorage.getItem('token')
                }
            })
            return res.data
        }catch(err){
            let msg = "服务器错误"
            if (err.response) {
                msg = err.response.data.msg
                Message.error(msg);
                return err.response.data
            } else {
                Message.error(msg);
                return {
                    code: -1,
                    msg: msg
                }
            }
        }
    }
}

export default HTTP