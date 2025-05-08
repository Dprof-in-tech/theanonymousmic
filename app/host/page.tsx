import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HostPage() {
  return (
    <div className="w-full px-4 py-8 bg-[url(/podcast.jpg)] bg-cover h-full bg-fixed ">
           <div className='w-full lg:w-[75%] mx-auto mt-24'>
      <h1 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Meet Your Host</h1>
      
      <div className="bg-transparent backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="w-40 h-40 relative rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/images/host-placeholder.jpg" // Replace with actual host image
                alt="Host Name" // Replace with actual host name
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Host Name</h2> {/* Replace with actual host name */}
              <p className="text-gray-500 mb-4">Founder & Host of The Anonymous Mic</p>
              
              <div className="flex space-x-4 mb-6">
                {/* Social media links - replace with actual links */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                  Twitter
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                  Instagram
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                  LinkedIn
                </a>
              </div>
              
              <div className="bg-green-50 px-4 py-3 rounded-md">
                <p className="italic text-gray-700">
                  &quot;I believe in the power of genuine communication. Sometimes the most honest thoughts can only be expressed anonymously.&quot;
                </p>
              </div>
            </div>
          </div>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">About Me</h3>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula, libero quis interdum tincidunt, 
              nisi libero aliquet urna, vel tempor metus nulla vitae tortor. Suspendisse potenti. Nulla facilisi. 
              Etiam efficitur tellus in ligula eleifend, at volutpat risus elementum.
            </p>
            <p>
              Praesent auctor, justo vel malesuada volutpat, nunc tortor vehicula nisl, vel facilisis metus magna sit amet purus. 
              Nullam at lectus eget nulla condimentum blandit. Vivamus auctor consequat nisl, eget eleifend dui pharetra in.
            </p>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">My Journey</h3>
            <p className="mb-4">
              Donec ut leo non magna facilisis aliquet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices 
              posuere cubilia curae; Mauris venenatis felis vitae varius rhoncus. Cras ullamcorper eros sit amet purus 
              convallis, vel molestie justo mattis.
            </p>
            <p>
              Suspendisse id iaculis risus. Nullam nec diam eget nulla suscipit rutrum. Ut ac risus vel magna luctus 
              venenatis id id magna. Nulla facilisi. Morbi augue lacus, faucibus at faucibus at, tincidunt eget elit.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-4">Why I Created The Anonymous Mic</h3>
            <p className="mb-4">
              Aliquam erat volutpat. Proin varius tortor vel lorem ultrices, in tincidunt libero malesuada. Cras dictum 
              massa in metus eleifend, quis malesuada turpis pharetra. Pellentesque habitant morbi tristique senectus et 
              netus et malesuada fames ac turpis egestas.
            </p>
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec suscipit 
              neque in lacus placerat, sed volutpat neque tempor. In hac habitasse platea dictumst. Fusce ac enim 
              vitae nulla condimentum aliquam eget at nunc.
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