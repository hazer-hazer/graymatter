# GrayMatter

GrayMatter is a collection of tools for personal use to help me dealing with everyday stuff.
For now, it only contains a single tool -- Inventory project which was primarily created to organize electronic components.

## Inventory

I'm currently deeply involved in DIY synthesizers, including both analog and digital.
When my carts from AliExpress began to be large and amount of distinct electronic components became so large I sometimes reordered the same thing multiple times, I started thinking about some organization of that stuff.
Tried different options but the best one was Sortly as it is friendly for personal use and has a bunch of convenient features. Anyway, it is pricey, I quicly went over the limit of 100 distinct items.
Thus, because I love reinventing the wheel, I started this project.

### Screenshots:
![image](https://github.com/hazer-hazer/graymatter/assets/29581311/bdeaca77-7b86-4717-b4d6-e5a40f75366c | height=400px)

### Stack

Both front-end and back-end use Typescript, modern ESLint with stylistic

**Front-end**:
- Vue.js v3 with Nuxt.js
- Pinia
- Quasar.js
- Material UI (via Quasar)

**Back-end and storages**:
- Node.js 21
- Fastify
- PostgreSQL with Prisma.js
- AJV with self-written JSON schema from TypeScript type definitions

### Features

- Any count of inventories can be created
- File-system-like hierarchy of folders and items. Special "Trash folder" is a kind of archive of items. 
- Item variants. Example: Item Resistor contains variants 1Ω, 1KΩ, 100KΩ, etc.
- Images for all of the above and some of them support image galleries.
- Custom attributes with user-defined schemas. For example: Model, shoe size
- Supports any ISO 4217 currency and prices
- Smart amount units system. Not only count (pcs) supported, you can even use meters to set the amount of item.
- Buy-lists with auto-check feature which watches amounts of items in list.
- Real life items flow: arrivals, usages and returns
  - Arrivals denote that some list of items is on the way to you, when it arrives you just click a button to add them
  - Usages say what some amount of item is used for
  - Returns not just magically increases the amount of items but says that something used got back because of some reason

### Planned

- Better search capabilities
- API for Personal Assistants (e.g. Yandex Station)
- Notifications 
