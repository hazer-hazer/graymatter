import bcrypt from 'bcrypt'

const crypt: Record<
    | 'password'
, {
    crypt(data: string): string
    check(data: string, hash: string): boolean
}> = {
    password: {
        crypt(password) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            return hash
        },
        check(password, hash) {
            return bcrypt.compareSync(password, hash)
        },
    },
}

export default crypt
