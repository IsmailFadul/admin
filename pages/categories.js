import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get(`/api/categories`).then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategories(ev) {
    ev.preventDefault();
    // Prevent an empty category name
    if (!name.trim()) {
      await Swal.fire({
        title: "Oops...",
        text: "Category name cannot be empty.",
        icon: "warning",
        confirmButtonText: "Got it",
      });
      return;
    }
    const data = { 
      name, 
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })) 
    };
    if (editedCategory?._id) {
      data._id = editedCategory._id;
      await axios.put(`/api/categories`, data);
      setEditedCategory(null);
    } else {
      await axios.post(`/api/categories`, data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({name,values}) => ({
        name,
        values:values.join(',')
      }))
    );
  }
  function deleteCategory(category) {
    Swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete(`/api/categories?_id=` + _id, { _id });
          fetchCategories();
        }
      });
  }
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyNameChenge(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValueChenge(index, property, newValue) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  }
  function removeProperties(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Category</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New Category name"}
      </label>
      <form onSubmit={saveCategories}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory || "0"}
          >
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map((Category) => (
                <option key={Category._id}value={Category._id}>{Category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-1">
            Add new properties
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index}className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  onChange={(ev) =>
                    handlePropertyNameChenge(index, property, ev.target.value)
                  }
                  value={property.name}
                  placeholder="Porperty name (exampl: color)"
                />
                <input
                  className="mb-0"
                  type="text"
                  onChange={(ev) =>
                    handlePropertyValueChenge(index, property, ev.target.value)
                  }
                  value={property.values}
                  placeholder="Value, comma, separted"
                />
                <button
                  type="button"
                  onClick={() => removeProperties(index)}
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button 
            type="button"
          onClick={() => {
            setEditedCategory(null);
            setName("");
            setParentCategory("");
            setProperties([]);
          }}
          className="btn-default">
            Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default Categories;
