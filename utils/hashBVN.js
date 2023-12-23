import bcrypt from 'bcrypt'


export const hashBVN = async(bvn)=>{

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(bvn,salt)

    return hash

}