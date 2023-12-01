<template>
    <q-breadcrumbs gutter="sm" class="q-pb-md">
        <q-breadcrumbs-el
            v-for="(segment, index) in path.segments"
            :key="index"
            :to="pathSegmentToUrl(segment, index)"
            :label="segment.name"
            :icon="pathSegmentKindIcon[segment.kind] ?? undefined"
        />
    </q-breadcrumbs>
</template>

<script lang="ts" setup>
import type { TreePath, TreePathSegment } from '~/models/inventory/Tree'

export interface IInventoryTreePath {
    path: TreePath
}

const { path } = defineProps<IInventoryTreePath>()

const pathSegmentKindIcon: Record<TreePathSegment['kind'], string | null> = {
    inventory: 'inventory_2',
    item: null,
    folder: null,
}

const inventoryUri = path.segments[0].uri
const segmentPathBaseUrl = '/inventory'
const pathSegmentToUrl = (segment: TreePathSegment, index: number): string => {
    if (segment.kind === 'folder') {
        return `${segmentPathBaseUrl}/${inventoryUri}/tree/${path.segments.slice(1, index + 1).map(seg => seg.uri).join('/')}`
    }
    if (segment.kind === 'inventory') {
        return `${segmentPathBaseUrl}/${segment.uri}`
    }
    if (segment.kind === 'item') {
        return `${segmentPathBaseUrl}/${segment.id}`
    }
    throw new Error(`Unknown tree path segment kind ${segment.kind}`)
}

</script>
