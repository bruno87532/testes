import * as bcrypt from "bcryptjs"

export function makeHash(text: string) {
    return bcrypt.hashSync(text, 10)
}