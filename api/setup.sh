# Setup everything needed to run Graymatter
# Also can be used as hard-reset for development

PRISMA_SCHEMA_PATH=./src/prisma/schema.prisma

npm i
npx prisma generate --schema $PRISMA_SCHEMA_PATH
npx prisma migrate reset --name init 

## TODO
