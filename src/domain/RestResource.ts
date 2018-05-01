interface RestResource<T> {
    _embedded: {
        [key: string]: T[]
    }
}