import Ticket from "@/components/Ticket/ticket";

export default function TicketPage(){
    
  return(
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-black dark:to-zinc-900 py-10 px-4">
      <Ticket/>
    </div>
  )
}