async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  return (
    <div>ProductDetails {id}</div>
  )
}

export default ProductDetails