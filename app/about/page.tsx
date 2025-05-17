import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full px-4 py-8 bg-[url(/podcast.jpg)] bg-cover h-full bg-fixed ">
      <div className='w-full lg:w-[75%] mx-auto mt-24'>
      <h1 className="text-2xl lg:text-3xl font-bold mb-8 text-center">About The Anonymous Mic</h1>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="p-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
            Giving voice to the silent whispers by providing a creative and safe platform for anonymous expression, empowering stories that inspire change, spark dialogue, and connect humanity beyond identity,
            sparking curiosity, laughter, and honest expression through anonymous storytelling — where voices are free, fun is fearless, and no identity is required.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="bg-green-50 p-6 text-gray-800 rounded-lg">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <span className="font-medium">Admin creates posts</span>: 
                  The admin creates posts with photos and names of featured individuals.
                </li>
                <li>
                  <span className="font-medium">Unique links are generated</span>: 
                  Each post gets a unique anonymous link that can be shared.
                </li>
                <li>
                  <span className="font-medium">Visitors send anonymous messages</span>: 
                  Anyone with the link can send completely anonymous messages to the featured person.
                </li>
                <li>
                  <span className="font-medium">Admin views messages</span>: 
                  The admin can view all messages sent to each post.
                </li>
              </ol>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Our Commitment to Privacy</h2>
            <p className="mb-4">
              We are committed to maintaining the highest standards of privacy and anonymity:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>No login required to send messages</li>
              <li>No IP addresses are logged</li>
              <li>No cookies are used to track users</li>
              <li>No personal information is collected</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions or concerns about The Anonymous Mic, please feel free to 
              reach out to us at <a href="mailto:contact@theanonymousmic.com" className="text-green-600 hover:underline">contact@theanonymousmic.com</a>.
            </p>
          </section>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-green-600 hover:text-green-800"
        >
          &larr; Back to Home
        </Link>
      </div>
      </div>
    </div>
  );
}