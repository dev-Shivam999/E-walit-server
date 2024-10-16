"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
   
    
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });


    if (toUser==null) {
        return {
            message: "User not found"
        }
    }

    
    
  try {
      const fromBalance = await prisma.balance.findUnique({
          where: { userId: Number(from) },
      });
      if (!fromBalance || fromBalance.amount < amount) {


          return {
              message: 'Insufficient funds'
          };
      }

    await prisma.$transaction(async (tx) => {
          await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;``
      

          await tx.balance.update({
              where: { userId: Number(from) },
              data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
              where: { userId: toUser.id },
              data: { amount: { increment: amount } },
          });
      });
      
      
      return {

          message: "done"
      }
  } catch (error) {
    console.log("error : ", error);
    
    return{
        message:"try later"
    }
  }
}