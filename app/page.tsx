/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllEvents } from "@/lib/db";
import EventCard from "./components/EventCard";
import AnimatedText from "./components/AnimatedText";
import Link from "next/link";

export default async function HomePage() {
  const events = await getAllEvents();

  return (
    <div className="w-full h-full">
      <section className="min-h-screen h-full w-full bg-[url(/podcast.jpg)] bg-cover  lg:bg-cover bg-fixed relative">
        <AnimatedText />
      </section>

        {/* Events Section */}
        <section className="bg-none backdrop-blur-lg px-8 py-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <Link
              href="/events" 
              className="text-[#F1EDE5] hover:text-green-800"
            >
              View all events &rarr;
            </Link>
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

      <footer className="bg-transparent border-t border-white/10 backdrop-blur-xs py-3 px-6 w-[92%] mx-auto rounded-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-xs lg:text-sm text-[#F1EDE5]">
                &copy; {new Date().getFullYear()} The Anonymous Mic. All rights
                reserved.
              </p>
            </div>
            <div className="lg:flex space-x-6 hidden">
            <a
                href="#"
                className="text-sm text-[#F1EDE5] hover:text-[#F1EDE5]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-[#F1EDE5] hover:text-[#F1EDE5]"
              >
                Terms of Service
              </a>
              <a
                href="/about"
                className="text-sm text-[#F1EDE5] hover:text-[#F1EDE5]"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}