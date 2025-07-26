"use client";
import React from 'react';
import { HeartPulse, Truck, Wrench, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NextSeo
        title="About Us | UVHub"
        description="Learn about UVHub's mission to empower healthier lives across Africa with premium fitness solutions."
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission at Ursula&apos;s Vitality Hub</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering longer, healthier, and more vibrant lives across Africa through premium fitness solutions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Story */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ursula&apos;s Vitality Hub</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We are not just selling gym equipment; we&apos;re providing the tools for a longer, healthier, and more vibrant life across Africa.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Imagine boosting your energy, strengthening your heart, and safeguarding your future against illness - that&apos;s the power we deliver. From Accra to Nairobi, Lagos to Cape Town, our top-tier, durable equipment empowers your journey to peak vitality.
              </p>
              <p className="text-lg text-gray-700">
                Whether you&apos;re building a home gym or upgrading a commercial space, invest in your health with Ursula&apos;s Vitality Hub - your partner in prolonging life and maximizing wellness, delivered right to your door!
              </p>
            </div>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden h-96">
              <Image
                src="/images/about.jpg"
                alt="Happy customers using our equipment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <HeartPulse className="w-10 h-10 text-blue-600" />,
                title: "Health First",
                description: "Equipment designed to maximize your cardiovascular health and longevity"
              },
              {
                icon: <Truck className="w-10 h-10 text-purple-600" />,
                title: "Free Delivery",
                description: "We bring your equipment right to your door across Africa"
              },
              {
                icon: <Wrench className="w-10 h-10 text-blue-600" />,
                title: "Professional Installation",
                description: "Our experts set up everything for immediate use"
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-purple-600" />,
                title: "Premium Quality",
                description: "Durable equipment built to last through your fitness journey"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Health?</h2>
            <p className="text-xl mb-8">
              We understand that convenience is key to consistency. That&apos;s why we offer FREE delivery and professional installation of all your equipment.
            </p>
            <p className="text-xl mb-8">
              You pick the gear, and we&apos;ll handle the rest, ensuring it&apos;s set up perfectly and ready for your first workout. No hidden fees, no hassle - just pure focus on your well-being.
            </p>
            <Link
              href="/home/all-products"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Our Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;