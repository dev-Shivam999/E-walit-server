import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };


    try {
     

        await db.$transaction([
            db.balance.upsert({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                update: {


                    amount: {
                        increment: Number(paymentInformation.amount)
                    },


                }, create: {
                    amount: Number(paymentInformation.amount),
                    locked: 0,
                    user: {
                        connect: {
                            id: Number(paymentInformation.userId),
                        },
                    },
                },
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",

                }
            })
        ]);


        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: e
        })
    }

})

app.listen(3011);