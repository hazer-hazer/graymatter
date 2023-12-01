import _ from 'lodash'

export const formatUri = (name: string) => {
    return _.kebabCase(name)
}
