import axios from 'axios'
import Config from '../config'
import { Notify } from 'vant'
class HTTP{
    static async request({url, data, method, params, headers}){
        let res
        try{
            res = await axios({
                url: Config.localURL + url,
                data: data,
                method: method,
                params: params,
                headers: {
                    'token': localStorage.getItem('token'),
                    ...headers
                }
            })
            return res.data
        }catch(err){
            let msg = "服务器错误"
            if (err.response) {
                msg = err.response.data.msg
                Notify({ type: 'warning', message: msg });
                return err.response.data
            } else {
                Notify({ type: 'warning', message: msg })
                return {
                    code: -1,
                    msg: msg
                }
            }
        }
    }
}

export default HTTP