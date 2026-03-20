import jwt from 'jsonwebtoken';

export const auth = (req:any,res:any,next:any)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.sendStatus(401);
  try{
    req.user = jwt.verify(token,'access');
    next();
  }catch{
    res.sendStatus(401);
  }
}
