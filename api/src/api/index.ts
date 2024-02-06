import { Api } from '@/App'
import img from './img'
import user from './user'
import auth from './auth'
import currency from './currency'

export default new Api({
    api: [
        img,
        user,
        auth,
        currency,
    ],
})
