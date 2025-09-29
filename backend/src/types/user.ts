export default interface User {
  id?: number;
  name: string;
  lastName: string;
  cpf: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  cep?: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}
