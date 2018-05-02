export interface RestResource<T> {
    _embedded: {
        [key: string]: WithLink<T>[]
    }
}

export type WithLink<T> = { _links: { self: Link, [key: string]: Link } } & T

interface Link {
    href: string
    templated?: boolean
}