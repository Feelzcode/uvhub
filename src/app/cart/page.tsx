import CartSummary from '@/components/CartSummary'
import React from 'react'
import CurrencyDetectionPopup from '@/components/CurrencyDetectionPopup'

const page = () => {
  return (
    <>
      <CartSummary/>
      <CurrencyDetectionPopup />
    </>
  )
}

export default page