const { SubscriptionPlan } = require('../models');




const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        console.log(plans)
        return res.status(200).json(plans);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getSubscriptionPlan = async (req, res) => {
    try {
        const id = req.params.id;
        const plan = await SubscriptionPlan.findById(id);
        return res.status(200).json(plan);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getActiveSubscriptionPlan=async(req,res)=>{

    try{
        const user_data=req.user;

        if(!user_data)
        {
            return res.status(404).send("User not found")
        }

        for(const i of user_data.subscriptions)
        {
            const currentdate = new Date();
            const startDate=new Date(i.startDate);
            const duration = i.orignalDuration;

            const endDate = new Date(startDate.getTime() + duration *30* 24 * 60 * 60 * 1000);

            console.log(endDate);

            console.log(startDate, currentdate, startDate<=currentdate);

            if(endDate>=currentdate && startDate<=currentdate)
            {
                const plan = await SubscriptionPlan.findById(i.plan);
                return res.json({
                    plan:plan,
                    status:i.status,
                    startDate:startDate,
                    endDate:endDate
                });
            }

        }
        return res.status(404).send("No active plan found");
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send("Internal server error");
    }
}




module.exports = { getSubscriptionPlans, getSubscriptionPlan,getActiveSubscriptionPlan };