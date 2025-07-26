"use client";
import CartSummary from '@/components/CartSummary'
import React from 'react'
import { NextSeo } from 'next-seo';

const page = () => {
  return (
    <>
      <NextSeo
        title="Your Cart | UVHub"
        description="View and manage the items in your shopping cart at UVHub. Ready to check out?"
      />
      <CartSummary />
    </>
  )
}

export default page