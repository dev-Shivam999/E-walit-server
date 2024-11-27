"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { OnRampTransaction } from "../app/lib/actions/OnRampTransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];


export const AddMoney = () => {
    const [amount, setAmount] = useState("")
    const [provider, setProvider] = useState(SUPPORTED_BANKS[1]?.name || "")
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    return <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={(e) => {
                setAmount(e)

            }} />
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value) => {
                setProvider(value)
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    if (Number(amount) > 0 && Number(amount) < 100000) {

                     await OnRampTransaction(Number(amount), provider)



                        window.location.href = redirectUrl || "";
                    } else if (Number(amount) <= 0) {
                        alert("Please  give greater than 0 amount")
                    } else {
                        alert("Out of limit amount")
                    }

                }}>
                    Add Money
                </Button>
            </div>
        </div>
    </Card>
}