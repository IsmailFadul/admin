import Layout from "@/components/layout";
import ProductForm from "@/components/productForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [prodctInfo, setProductsInfo] = useState(null)
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // normalize id from [...id]
    const normalizedId = Array.isArray(id) ? id[id.length - 1] : id;

    axios.get(`/api/products?id=${normalizedId}`)
      .then(response => {
        setProductsInfo(response.data);
      })
      .catch(err => console.error("Axios error:", err));
  }, [id]);

  return (
    <Layout>
        <h1>Edit Product</h1>
        {prodctInfo && (
            <ProductForm {...prodctInfo}/>
        )}
      
    </Layout>
  );
}