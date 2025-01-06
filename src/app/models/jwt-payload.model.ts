export interface JwtPayload {
  nameid: string; // Maps to ClaimTypes.NameIdentifier
  unique_name: string; // Maps to ClaimTypes.Name
  email: string; // Maps to ClaimTypes.Email
  role: string; // Maps to ClaimTypes.Role
  exp: number; // Expiry timestamp
}
