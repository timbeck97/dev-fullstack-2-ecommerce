export default interface User{
      id?: number;
      name: string;
      lastName:string;
      cpf:string;
      birthDate?:string,
      address?: string,
      number?:string,
      email:string,
      username: string;
      password: string; 
      role: 'ADMIN' | 'USER';
}