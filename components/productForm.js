import axios from "axios";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";
import Image from "next/image";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [productsProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [category, setCategory] = useState(assignedCategory || "");
  const [images, setImages] = useState(existingImages || []);

  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  console.log({ _id });
  useEffect(() => {
    axios.get(`/api/categories`).then((result) => {
      setCategories(result.data);
    });
  }, []);
  async function saveProducts(ev) {
    ev.preventDefault();

    // Collect missing fields
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!description) missingFields.push("Description");
    if (!price) missingFields.push("Price");

    if (missingFields.length > 0) {
      const result = await Swal.fire({
        title: "Some fields are empty!",
        html: `Missing: <strong>${missingFields.join(", ")}</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Save anyway",
        cancelButtonText: "Go back",
      });

      // If the user cancels, stop here
      if (!result.isConfirmed) return;
    }

    // Proceed to save
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productsProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }

    setToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }
  async function UploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProducts}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="prodct name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => <option key={c._id}value={c._id}>{c.name}</option>)}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name}className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productsProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Product Photo</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-md border border-gray-500">
                <Image src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div
            className="h-24 bg-gray-200 p-1 flex 
                    items-center"
          >
            <Spinner />
          </div>
        )}
        <label
          className="w-24 h-24 text-sm 
                text-center text-primary flex flex-col items-center 
                justify-center gap-1
                rounded-lg bg-white 
                cursor-pointer
                shadow-md border border-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            Add image
          </div>
          <input type="file" onChange={UploadImages} className="hidden " />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
