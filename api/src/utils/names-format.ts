import _ from 'lodash'

export const formatUri = (name: string) => {
    return _.kebabCase(name)
}

export const emailToUri = (email: string) => {
    return email.split('@')[0].replaceAll(/\W/g, '-')
}
