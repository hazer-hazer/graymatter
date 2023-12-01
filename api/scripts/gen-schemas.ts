import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import * as path from 'path'
import * as tsj from 'ts-json-schema-generator'
import { FastifySchema } from 'fastify'
import _ from 'lodash'
import { createHash } from 'crypto'

class BigIntParser implements tsj.SubNodeParser {
    supportsNode(node: tsj.ts.Node): boolean {
        return node.kind === tsj.ts.SyntaxKind.BigIntKeyword
    }

    createType(): tsj.BaseType {
        return new tsj.StringType
    }
}

// class BigIntFormatter implements tsj.SubTypeFormatter {
//     public supportsType(type: tsj.UnknownType): boolean {
//         return type instanceof tsj.UnknownType
//     }

//     public getDefinition(): tsj.Definition {
//         console.log('GET DEFINITION')
        
//         return {
//             type: 'object',
//         }
//     }

//     public getChildren(): tsj.BaseType[] {
//         return []
//     }
// }

// Does not work with Prisma types because of BigInt and super complex utility types

const basePath = './src'

const apiPaths = [
    'api',
    'projects/**/api',
]

const tsConfigPath = './tsconfig.json'
const schemaFilename = '**/schemas.ts'
const outputFilename = 'schemas.json'
const refSchemaFiles = './src/**/schemas.ts'
const refSchemaOutputFilepath = './src/ref-schema.json'
const refSchemaName = 'refSchema'
// const refSchemaHashFilepath = path.join(basePath, '.refschemahash.json')

/**
 * body?: unknown;
  querystring?: unknown;
  params?: unknown;
  headers?: unknown;
  response?: unknown;
 */

const clarifySchemaRefs = (schema: tsj.Schema): tsj.Schema => {
    return Object.fromEntries(
        Object.entries(schema).map(([key, subSchema]) => {
            if (key === '$ref' && typeof subSchema === 'string') {
                return [key, `${refSchemaName}${subSchema}`]
            }

            if (!_.isArray(subSchema) && _.isObject(subSchema)) {
                return [key, clarifySchemaRefs(subSchema)]
            }

            return [key, subSchema]
        }),
    ) as tsj.Schema
}

const formatSchemas = ({ definitions }: tsj.Schema): (Record<string, FastifySchema>) =>
    Object.fromEntries(
        Object.entries(definitions ?? {})
            .map(([schemaName, schema]) => {
                if (typeof schema === 'boolean') {
                    return [schemaName, {}]
                }
                const params = schema.properties?.Params
                const headers = schema.properties?.headers
                const querystring = schema.properties?.Querystring
                const body = schema.properties?.Body
                const response = schema.properties?.Reply as tsj.Schema
                const consumes = schema.properties?.consumes

                return [schemaName, {
                    ...params && { params },
                    ...headers && { headers },
                    ...querystring && { querystring },
                    ...body && { body },
                    ...response && { response: response.properties },
                    ...consumes && { consumes },
                }]
            }))

const hasImportSchemas = (content: string) => /'\.\/schemas\.json'/g.test(content)

// Not working with metaschema so far
// const fastSchemaStringify = fastJsonStringify(jsonSchemaDraft07 as unknown as Schema)

const importSchemas = `
export { default as schemas } from './schemas.json'
`.trim()

const genSchema = (filepath: string, id?: string): tsj.Schema => {
    const config: tsj.Config = {
        path: filepath,
        tsconfig: tsConfigPath,
        type: '*',
        schemaId: id ?? path.basename(filepath).toString().split('.').slice(0, -1).join('.'),
    }

    console.log(`Generating ${filepath} schema... ($id: ${config.schemaId})`)

    const program = tsj.createProgram(config)
    const parser = tsj.createParser(program, config, prs => {
        prs.addNodeParser(new BigIntParser())
    })
    const formatter = tsj.createFormatter(config, () => {
        // fmt.addTypeFormatter(new BigIntFormatter())
    })
    const generator = new tsj.SchemaGenerator(program, parser, formatter, config)

    return generator.createSchema(config.type)
}

void (async () => {
    // Generate schema for all `schemas.ts`
    const paths = await apiPaths.reduce(async (paths_: Promise<string[]>, apiPath) => {
        const paths = await paths_
        const globPattern = path.join(basePath, apiPath, schemaFilename)
        const files = await glob(globPattern)

        return [...paths, ...files]
    }, Promise.resolve([]))

    // const hash = createHash('sha256');

    for (const filepath of paths) {
        const formattedSchema = clarifySchemaRefs(formatSchemas(genSchema(filepath)))

        const outputPath = path.join(path.dirname(filepath), outputFilename)
        const schemaString = JSON.stringify(formattedSchema, null, 4)

        // hash.update(schemaString)

        writeFileSync(outputPath, schemaString, 'utf-8')

        const tsFileContent = readFileSync(filepath, 'utf-8')
        if (!hasImportSchemas(tsFileContent)) {
            const addedImport = `${importSchemas}\n${tsFileContent}`
            writeFileSync(filepath, addedImport, 'utf-8')
        }
    }

    // Generate reference schema including all types from `schemas.ts`
    const refSchema = genSchema(refSchemaFiles, refSchemaName)
    const refSchemaString = JSON.stringify(refSchema, null, 4)
    // const schemasHash = hash.digest('hex');
    // refSchema.hash = schemasHash;

    writeFileSync(refSchemaOutputFilepath, refSchemaString, 'utf-8')
})()
