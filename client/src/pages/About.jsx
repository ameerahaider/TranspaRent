import React from 'react';

export default function About() {
  return (
    <div className='bg-orange-200'>
      <div className='flex flex-col gap-8 p-8 md:p-16 max-w-6xl mx-auto'>
        <header className="text-left">
          <h1 className='text-white font-bold text-4xl md:text-6xl'>
            Welcome to <span className='text-orange-500'>Transpa</span><span className='text-black'>Rent</span>
          </h1>
          <p className='text-black text-lg md:text-xl mt-4'>
            Redefining Home, Where Blockchain Meets Comfort.
          </p>
        </header>

        <section className='text-gray-800 text-base md:text-lg'>
          <p className="text-lg text-gray-900 leading-relaxed">
            TranspaRent is your go-to destination to find your next perfect place to live. We prioritize your security and privacy through our top-of-the-line blockchain technology.
          </p>
        </section>

        {/* Additional Information */}
        <section className='mt-12'>
          <h2 className='text-white font-bold text-3xl md:text-5xl border-b-2 border-gray-800 pb-2'>
            Our Vision
          </h2>
          <p className='text-gray-800 text-base md:text-lg mt-4 leading-relaxed'>
            At TranspaRent, we envision a future where property rental transactions are secure, efficient, and completely transparent. By leveraging blockchain, we aim to eliminate traditional barriers and create a decentralized ecosystem that empowers users while ensuring trust and integrity in every interaction.
          </p>

          <h2 className='text-white font-bold text-3xl md:text-5xl mt-8 border-b-2 border-gray-800 pb-2'>
            How It Works
          </h2>
          <ol className='list-decimal text-gray-800 text-base md:text-lg mt-4 pl-4'>
            <li className="mb-2">Browse: Explore a vast array of rental properties.</li>
            <li className="mb-2">Secure: Utilize the robust security of blockchain.</li>
            <li className="mb-2">Transact: Complete your rental agreement seamlessly with our user-friendly platform.</li>
          </ol>
        </section>

        <section className='text-gray-800 text-base md:text-lg mt-8'>
          <p className="text-lg text-gray-900 leading-relaxed">
            <strong>TranspaRent invites you to join us in creating a future where property rental is efficient, secure, and accessible to everyone. Whether you're a property owner or a prospective tenant, our platform is tailored to meet your needs and exceed your expectations.</strong>
          </p>

          <p className='mt-4 text-lg text-gray-900 leading-relaxed'>
            <strong>Experience the future of property rental with TranspaRent - Where Blockchain Meets Home.</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
