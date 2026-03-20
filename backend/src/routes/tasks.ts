import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
import {auth} from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(auth);

router.get('/', async(req:any,res)=>{
  const {page=1,limit=5,search='',status} = req.query;

  const tasks = await prisma.task.findMany({
    where:{
      userId:req.user.id,
      title:{contains:String(search)},
      ...(status && {completed: status==='true'})
    },
    skip:(page-1)*limit,
    take:Number(limit)
  });

  res.json(tasks);
});

router.post('/', async(req:any,res)=>{
  const task = await prisma.task.create({
    data:{title:req.body.title,userId:req.user.id}
  });
  res.status(201).json(task);
});

router.patch('/:id', async(req,res)=>{
  const task = await prisma.task.update({
    where:{id:Number(req.params.id)},
    data:req.body
  });
  res.json(task);
});

router.delete('/:id', async(req,res)=>{
  await prisma.task.delete({where:{id:Number(req.params.id)}});
  res.json({msg:'deleted'});
});

router.patch('/:id/toggle', async(req,res)=>{
  const t = await prisma.task.findUnique({where:{id:Number(req.params.id)}});
  const task = await prisma.task.update({
    where:{id:Number(req.params.id)},
    data:{completed:!t?.completed}
  });
  res.json(task);
});

export default router;
