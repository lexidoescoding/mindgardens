export default function binarySearch(arr: any[], value: any, key: string) {
    let left = 0, right = arr.length

    while (left < right) {
        const mid = Math.floor((left + right) / 2)
        if (arr[mid][key] < value) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return left
}