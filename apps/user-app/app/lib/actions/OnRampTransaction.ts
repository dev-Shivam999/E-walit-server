"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"
import axios from "axios"



export async function OnRampTransaction(amount: number, provider: string) {
    const id = await getServerSession(authOptions)

    const token = Math.random() * 100;
    const userId = id?.user?.id
    if (!userId) {
        return {
            message: "user not login "
        }
    }
    try {
      await prisma.onRampTransaction.create({
            data: {
                userId: Number(userId),

                amount: amount,
                provider, startTime: new Date(),
                status: "Processing"
                , token: String(token)
            }
        })

       await axios.post(`${process.env.NEW_URL}/hdfcWebhook`, {
            token: String(token),
           user_identifier: userId,
            amount: String(amount)
})
      
        return {
            message: "done"
        }
    } catch (error) {
        return {
            error
        }
    }

}