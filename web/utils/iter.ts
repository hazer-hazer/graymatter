export function chunk<T> (arr: T[], chunkSize: number): T[][] {
    return arr.reduce((chunks: T[][], el, index) => {
        const chunkIndex = Math.floor(index / chunkSize)
        chunks[chunkIndex] ??= []
        chunks[chunkIndex].push(el)
        return chunks
    }, [])
}


