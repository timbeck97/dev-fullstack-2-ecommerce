import { Router, Request, Response } from "express";

const router = Router();

interface User {
  id?: number;
  name: string;
  lastName:string;
  cpf:string;
  birthDate:string
}

let users: User[] = [];
let sequence = 1;


router.post("/", (req: Request, res: Response) => {
  const { name , lastName, cpf, birthDate} = req.body;
   if(users.find(u=>u.cpf===cpf)){
    return res.status(404).json({ error: "Já existe um cadastro para esse CPF" });
  }
  const newUser:User = {
    id:sequence++, name, lastName, cpf, birthDate
  }
  users.push(newUser);
  res.status(201).json(newUser);
});


router.get("/", (req: Request, res: Response) => {
  let usersResponse=users;
   let {name} = req.query
    if(name){
      usersResponse = usersResponse.filter(p=>p.name.toLowerCase().includes(String(name).toLowerCase())) 
    }
  res.json(usersResponse);
});


router.get("/:id", (req: Request, res: Response) => {
  const item = users.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(item);
});


router.put("/:id", (req: Request, res: Response) => {
  const user = users.find(i => i.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  user.name = req.body.name || user.name
  user.lastName = req.body.lastName || user.lastName
  user.cpf = req.body.cpf || user.cpf
  user.birthDate = req.body.birthDate || user.birthDate
  res.json(user);
});


router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  if(!users.find(u=>u.id===id)){
    return res.status(404).json({error:`Usuário ${id} não encontrado`})
  }
  users = users.filter(i => i.id !==id);
  res.status(204).send();
});

export default router;