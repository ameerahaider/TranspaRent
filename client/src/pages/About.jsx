import React from 'react';

export default function About() {
  return (
    <div className='bg-orange-500'>
      <div className='flex flex-col gap-8 p-8 md:p-16 max-w-6xl mx-auto'>
        <header>
          <h1 className='text-white font-bold text-4xl md:text-6xl'>
            Welcome to Transpa<span className='text-black'>Rent</span>
          </h1>
          <p className='text-white text-sm sm:text-base mt-4'>
            Redefining Home, Where Blockchain Meets Comfort.
          </p>
        </header>

        <section className='text-gray-100 text-sm sm:text-base'>
          <p>
            TranspaRent is your go-to destination to find your next perfect place
            to live. We prioritize your security and privacy through our
            top-of-the-line blockchain technology.
          </p>
        </section>

        {/* Additional Information */}
        <section className='mt-12'>
          <h2 className='text-white font-bold text-2xl md:text-4xl'>
            Our Vision
          </h2>
          <p className='text-white text-sm sm:text-base mt-4'>
            At TranspaRent, we envision a future where property rental
            transactions are secure, efficient, and completely transparent. By
            leveraging blockchain, we aim to eliminate traditional barriers and
            create a decentralized ecosystem that empowers users while ensuring
            trust and integrity in every interaction.
          </p>

          <h2 className='text-white font-bold text-2xl md:text-4xl mt-8'>
            How It Works
          </h2>
          <ol className='list-decimal text-white text-sm sm:text-base mt-4 pl-4'>
            <li>Browse: Explore a vast array of rental properties.</li>
            <li>Secure: Utilize the robust security of blockchain.</li>
            <li>
              Transact: Complete your rental agreement seamlessly with our
              user-friendly platform.
            </li>
          </ol>
        </section>

        <section className='text-white text-sm sm:text-base mt-8'>
          <p>
            TranspaRent invites you to join us in creating a future where
            property rental is efficient, secure, and accessible to everyone.
            Whether you're a property owner or a prospective tenant, our platform
            is tailored to meet your needs and exceed your expectations.
          </p>

          <p className='mt-4'>
            Experience the future of property rental with TranspaRent - Where
            Blockchain Meets Home.
          </p>
        </section>
      </div>
    </div>
  );
}
