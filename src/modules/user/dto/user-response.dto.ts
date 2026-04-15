import { Expose, Exclude, Transform, Type } from "class-transformer"

class User {
    @Expose()
    @Transform(({ value }) => {
        if (!value || typeof value !== "string") return value
        const [name, domain] = value.split("@")
        if (!name || !domain) return value
        if (name.length <= 4) {
            return `${name.replace(/./g, "*")}@${domain}`
        }

        const start = name.slice(0, 2);
        const middle = name.slice(2, -2).replace(/./g, "*")
        const end = name.slice(-2)

        return `${start}${middle}${end}@${domain}`
    })
    email!: string

    @Expose()
    name!: string

    @Expose()
    id!: string

    @Exclude()
    password!: string
}

export class UserResponseDto {
    @Expose()
    @Type(() => User)
    user!: User
}