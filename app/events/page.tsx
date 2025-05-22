import React from "react";
import EventCard from "../components/EventCard";
import { getAllEvents } from "@/lib/db";

const Events = async () => {
    const events = await getAllEvents();
    return (
        <div>
         {/* Events Section */}
         <section className="min-h-screen h-full w-full bg-[url(/podcast-mobile1.jpg)] lg:bg-[url(/podcast.jpg)] bg-contain bg-no-repeat  lg:bg-cover bg-fixed relative py-[6rem]">
         <div className="container mx-auto py-8">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-semibold">All Events</h2>
           </div>
 
           {events.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {events.map((event) => (
                 <EventCard key={event.id} event={event} />
               ))}
             </div>
           ) : (
             <p className="text-center text-[#F1EDE5] py-8">No upcoming events at the moment. Check back soon!</p>
           )}
         </div>
       </section>
       </div>
    )
}

export default Events;