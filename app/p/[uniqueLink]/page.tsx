/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostByUniqueLink } from '@/lib/db';
import { notFound } from 'next/navigation';
import MessageForm from '@/app/components/MessageForm';
import Image from 'next/image';

// Use 'any' type to bypass TypeScript checking
export default async function PostPage({ params }: any) {
  const { uniqueLink } = params;
  
  const posts = await getPostByUniqueLink(uniqueLink);
  
  if (!posts || posts.length === 0) {
    notFound();
  }
  
  const post = posts[0];
  const displayName = post.nickname || post.name;
  
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center px-4 py-8 bg-[url(/podcast.jpg)] bg-cover bg-fixed">
      <div className="bg-white rounded-lg shadow-md w-full lg:w-[42%] mt-24 overflow-hidden">
        <div className="p-6 text-center">
          <div className="mb-6 mx-auto relative w-40 h-40 rounded-full overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={displayName}
              className="rounded-full object-cover w-full h-full"
              width={160}
              height={160}
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-black">{displayName}</h1>
          <p className="text-gray-600 mb-6">Send an anonymous message</p>
          
          <MessageForm uniqueLink={uniqueLink} />
          
          <div className="mt-8 text-sm text-[#F1EDE5]">
            <p>Your message will be completely anonymous.</p>
            <p>No login or personal information is collected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}