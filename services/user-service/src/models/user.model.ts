import type { MySQLPool } from "@fastify/mysql"

export interface User {
  id?: number
  email: string
  password: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface UserWithoutPassword {
  id?: number
  email: string
  name: string
  created_at?: string
  updated_at?: string
}

export class UserModel {
  private db: MySQLPool

  constructor(db: MySQLPool) {
    this.db = db
  }

  async create(
    userData: Omit<User, "id" | "created_at" | "updated_at">,
  ): Promise<UserWithoutPassword> {
    const result = await this.db.execute(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [userData.email, userData.password, userData.name],
    )

    const insertId = (result as any)[0].insertId

    const userResult = await this.db.execute(
      "SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?",
      [insertId],
    )

    const users = (userResult as any)[0] as UserWithoutPassword[]
    return users[0]!
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    )

    const users = (result as any)[0] as User[]
    return users.length > 0 ? users[0]! : null
  }

  async findById(id: number): Promise<UserWithoutPassword | null> {
    const result = await this.db.execute(
      "SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?",
      [id],
    )

    const users = (result as any)[0] as UserWithoutPassword[]
    return users.length > 0 ? users[0]! : null
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user !== null
  }
}

export default UserModel
