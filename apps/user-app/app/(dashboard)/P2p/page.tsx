import { SendCard } from "../../../components/Send";
import { getBalance } from "../transfer/page";

export default async function () {
    const b=await getBalance()
    return <div className="w-full">
        <SendCard balance={b.amount}/>
       
    </div>
}