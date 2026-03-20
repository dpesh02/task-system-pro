import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async(req,res)=>{
  const {email,password} = req.body;
  const hash = await bcrypt.hash(password,10);
  const user = await prisma.user.create({data:{email,password:hash}});
  res.status(201).json(user);
});

router.post('/login', async(req,res)=>{
  const {email,password} = req.body;
  const user = await prisma.user.findUnique({where:{email}});
  if(!user) return res.sendStatus(401);

  const valid = await bcrypt.compare(password,user.password);
  if(!valid) return res.sendStatus(401);

  const access = jwt.sign({id:user.id},'access',{expiresIn:'15m'});
  const refresh = jwt.sign({id:user.id},'refresh',{expiresIn:'7d'});

  await prisma.user.update({
    where:{id:user.id},
    data:{refreshToken:refresh}
  });

  res.json({access,refresh});
});

router.post('/refresh', async(req,res)=>{
  const {token} = req.body;
  try{
    const data:any = jwt.verify(token,'refresh');
    const user = await prisma.user.findUnique({where:{id:data.id}});
    if(user?.refreshToken !== token) return res.sendStatus(403);

    const access = jwt.sign({id:data.id},'access',{expiresIn:'15m'});
    res.json({access});
  }catch{
    res.sendStatus(401);
  }
});

router.post('/logout', async(req,res)=>{
  const {userId} = req.body;
  await prisma.user.update({
    where:{id:userId},
    data:{refreshToken:null}
  });
  res.json({msg:'logged out'});
});

export default router;
