"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import {  useState } from "react";
import { p2pTransfer } from "../app/lib/actions/Tran";

export function SendCard({balance}:{balance:number}) {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [bal, setBalance] = useState(balance);

    async function send() {
    
        
     
        const p = await p2pTransfer(number, Number(amount))
        console.log(p.message);
        
        
        if (p.message=="done") {
       setBalance(p=>p-Number(amount))
        }else{
            alert(p.message)
        }
       
    }

    return <div className="h-[90vh]">
        <Center> 
            <Card title="Send">

                <div className="min-w-72 pt-2">
                 Your Balance {bal}
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={() =>send()}>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}