export default interface AuthUser {
  id: number;
  cpf: string;
  role: "ADMIN" | "USER";
  token: string;
}