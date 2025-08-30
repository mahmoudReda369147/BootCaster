//create apost function to handle payments
import Stripe from "stripe";
import { NextResponse } from "next/server";

import asyncWraper from "@/utils/asyncWraper";

import connectToDatabase from "@/lib/dbConection";
import { User } from "@/models/userModel";






export const POST = asyncWraper(async (req) => {
    await connectToDatabase();
    
   
    const stripe = new Stripe(process.env.NEXT_PUPIC_STRIPE_KEY);
   const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature"),
    process.env.NEXT_PUPLIC_WEBHOOK_SECRIT_KEY
   );
   
   switch (event.type) {
    case 'checkout.session.completed':
       
        const {amount_subtotal,customer_details:{email}} = event.data.object;
        console.log(amount_subtotal,email);
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({message: "User not found"},{status: 404});
        }
        if (amount_subtotal === 2900){
            user.plan = "pro";
            user.botcastPlanNumber = 10;
           
           
        }else if(amount_subtotal === 9900){
            user.plan = "enterprise";
            user.botcastPlanNumber = 20;
        }
        user.canCreateBootCastes = true
        await user.save();
        break;
    case 'customer.subscription.deleted':
        const subscriptionId = event.data.object.id; 
     const subscriptions = await stripe.subscriptions.retrieve(subscriptionId);
     const customerId = subscriptions.customer;
     const customer = await stripe.customers.retrieve(customerId);
     console.log(customer);
        break;
    default:
        console.log(`Unhandled event type ${event.type}`);
        break;
   }
return NextResponse.json({ message: "Hello, world! from payments",event: event });

 
})



