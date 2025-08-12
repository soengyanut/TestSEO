import React, { useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "../../features/product/productSlice2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useUploadFileMutation } from "../../features/file/fileSlice";

export default function Product() {
  const { data: productsData, isLoading, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null); // store image file
  const [preview, setPreview] = useState(null); // object url
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Placeholder for update/delete logic
  const [updateProduct] = useUpdateProductMutation();
  const [uploadFile] = useUploadFileMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleUpdate = (row) => {
    toast.info(`Update clicked for: ${row.name}`);
  };

  const handleDelete = async (row) => {
    console.log("The row uuid", row.uuid);
    try {
      await deleteProduct({ uuid: row.uuid }).unwrap();
      toast.success(`${row.name} deleted successfully!`);
      refetch();
    } catch (error) {
      toast.error(`Failed to delete ${row.name}`,error);
    }
  };

  // handle preview image
  const handleImagePreview = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // handle upload file
  const fileInputRef = useRef();

  const handleCreateProduct = async (data) => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formdata = new FormData();
    formdata.append("files", image);

    console.log("formdata", formdata);

    try {
      const fileRes = await uploadFile(formdata).unwrap();
      console.log("upload image", image);
      
      await createProduct({
        createProduct: {
          name: data.name,
          description: data.description,
          priceIn: Number(data.priceIn),
          priceOut: Number(data.priceOut),
          discount: Number(data.discount),
          thumbnail: fileRes.uri,
          computerSpec: {
            processor: "N/A",
            ram: "N/A",
            storage: "N/A",
            gpu: "N/A",
            os: "N/A",
            screenSize: "N/A",
            battery: "N/A"
          },
          stockQuantity: 0,
          color: [],
          warranty: "",
          availability: true,
          images: [],
          categoryUuid: "eb115ca4-a6b2-43f7-aa59-2def7e30dd7b",
          supplierUuid: "fd9d42e3-3afc-43a8-8eb4-7cb4c1c9b411",
          brandUuid: "8620f990-ef33-495c-b38c-236da90c9b46"
        }
      }).unwrap();
      
      toast.success("Product created successfully!");
      setShowModal(false);
      reset();
      setImage(null);
      setPreview(null);
      refetch();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    reset();
    setImage(null);
    setPreview(null);
    // Clean up object URL to prevent memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  // Table columns
  const columns = [
    {
      name: "Thumbnail",
      selector: row => (
        <img 
          src={row.thumbnail} 
          alt={row.name} 
          style={{ width: 50, height: 50, objectFit: 'cover' }} 
          onError={(e) => {
            e.target.src = '/placeholder-image.png'; // Fallback image
          }}
        />
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: row => `$${row.priceOut}`,
      sortable: true,
    },
    {
      name: "Stock",
      selector: row => row.stockQuantity,
      sortable: true,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="grid grid-cols-2 gap-2">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded text-xs transition-colors"
            onClick={() => handleUpdate(row)}
          >
            Update
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded text-xs transition-colors"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <ToastContainer position="top-right" />
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="border p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Product"}
        </button>
      </div>
      
      <section>
        <DataTable
          columns={columns}
          data={productsData?.content || []}
          progressPending={isLoading}
          pagination
          highlightOnHover
          pointerOnHover
          onRowClicked={row => setPreviewProduct(row)}
        />
      </section>

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{previewProduct.name}</h2>
            <img 
              src={previewProduct.thumbnail} 
              alt={previewProduct.name} 
              className="mb-2 w-full h-40 object-contain rounded" 
              onError={(e) => {
                e.target.src = '/placeholder-image.png'; // Fallback image
              }}
            />
            <p className="mb-2">{previewProduct.description}</p>
            <p className="mb-2"><strong>Price:</strong> ${previewProduct.priceOut}</p>
            <p className="mb-4"><strong>Stock:</strong> {previewProduct.stockQuantity}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              onClick={() => setPreviewProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Product</h2>
            <form onSubmit={handleSubmit(handleCreateProduct)} className="flex flex-col gap-3">
              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>

              <div>
                <textarea
                  className={`border p-2 rounded w-full ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Description"
                  rows="3"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
              </div>

              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.priceIn ? 'border-red-500' : ''}`}
                  placeholder="Price In"
                  type="number"
                  step="0.01"
                  {...register("priceIn", { 
                    required: "Price In is required",
                    min: { value: 0, message: "Price must be positive" }
                  })}
                />
                {errors.priceIn && <span className="text-red-500 text-sm">{errors.priceIn.message}</span>}
              </div>

              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.priceOut ? 'border-red-500' : ''}`}
                  placeholder="Price Out"
                  type="number"
                  step="0.01"
                  {...register("priceOut", { 
                    required: "Price Out is required",
                    min: { value: 0, message: "Price must be positive" }
                  })}
                />
                {errors.priceOut && <span className="text-red-500 text-sm">{errors.priceOut.message}</span>}
              </div>

              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.discount ? 'border-red-500' : ''}`}
                  placeholder="Discount (%)"
                  type="number"
                  min="0"
                  max="100"
                  {...register("discount", { 
                    required: "Discount is required",
                    min: { value: 0, message: "Discount must be 0 or more" },
                    max: { value: 100, message: "Discount cannot exceed 100%" }
                  })}
                />
                {errors.discount && <span className="text-red-500 text-sm">{errors.discount.message}</span>}
              </div>

              {/* File upload input */}
              <div>
                <input
                  className="border p-2 rounded w-full"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImagePreview}
                />
                {!image && <span className="text-red-500 text-sm">Image is required</span>}
              </div>

              {/* Image preview */}
              {preview && (
                <div className="flex justify-center">
                  <img
                    className="w-32 h-32 rounded object-cover border"
                    src={preview}
                    alt="preview"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex-1"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors flex-1"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}