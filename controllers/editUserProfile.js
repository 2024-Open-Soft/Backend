const { PrismaClient } = require('@prisma/client');
const { Model } = require('mongoose');

const prisma = new PrismaClient();



async function updateUserProfile(req,res){
    
    try {
        const userId=req.user.id;
        const updateData = req.body;
        const updatedUserData = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData
        })

        if (!updatedUserData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUserData);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }


}

module.exports ={
    updateUserProfile
}
