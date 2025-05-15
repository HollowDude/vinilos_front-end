export type UserRole = "administrador" | "tatuador" | "perforador"

export interface AuthCheck {
  authenticated: boolean
  user?: string
  tipo_user?: UserRole
}
