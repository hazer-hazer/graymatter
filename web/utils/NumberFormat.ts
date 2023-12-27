import defu from 'defu'

export interface NumberFormatOptions {

}

const DEFAULT_NUMBER_FORMAT_OPTIONS: NumberFormatOptions = {

}

export class NumberFormat {
    private options: NumberFormatOptions

    constructor (options: NumberFormatOptions) {
        this.options = defu(options, DEFAULT_NUMBER_FORMAT_OPTIONS)
    }
}
