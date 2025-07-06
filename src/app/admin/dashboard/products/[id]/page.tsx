async function ProductDetails({ params }: { params: { id: string } }) {
    const { id } = params;
  return (
    <div>ProductDetails {id}</div>
  )
}

export default ProductDetails