"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { apiClient } from "@/utils/helper";
import Image from "next/image";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  basePrice: Yup.string()
    .matches(/^\d*\.?\d+$/, "Base price must be a number")
    .required("Base price is required"),
  salePrice: Yup.string()
    .matches(/^\d*\.?\d+$/, "Sale price must be a number")
    .nullable(),
  c_id: Yup.string().required("Category ID is required"),
  dimensions: Yup.string().required("Dimensions are required"),
  specifications: Yup.string().required("Specifications are required"),
  features: Yup.string().required("Features are required"),
  weight: Yup.string().required("Weight is required"),
  main_image: Yup.mixed().required("Main image is required"),
  images: Yup.mixed().required("Additional images are required"),
  bestSeller: Yup.boolean(),
});

interface ProductFormData {
  name: string;
  description: string;
  basePrice: string;
  salePrice: string;
  c_id: string;
  dimensions: string;
  specifications: string;
  features: string;
  weight: string;
  main_image: File | null;
  images: File[] | null;
  bestSeller: boolean;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);

  const handleSubmit = async (values: ProductFormData) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("basePrice", values.basePrice);
      formData.append("salePrice", values.salePrice);
      formData.append("c_id", values.c_id);
      formData.append("dimensions", values.dimensions);
      formData.append("specifications", values.specifications);
      formData.append("features", values.features);
      formData.append("weight", values.weight);
      formData.append("bestSeller", values.bestSeller ? "1" : "0");
      
      // Add main image
      if (values.main_image) {
        formData.append("main_image", values.main_image);
      }
      
      // Add additional images
      if (values.images && values.images.length > 0) {
        values.images.forEach((image, index) => {
          formData.append("images", image);
        });
      }

      const response = await apiClient('products', { 
        method: 'POST', 
        body: formData 
      });

      console.log("Product created:", response);

      toast("Success!", {
        description: "Product created successfully",
      });
      
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast("Error!", {
        description: error.message || "Failed to create product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("main_image", file);
      const preview = URL.createObjectURL(file);
      setMainImagePreview(preview);
    }
  };

  const handleAdditionalImagesChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const files = Array.from(event.currentTarget.files || []);
    if (files.length > 0) {
      setFieldValue("images", files);
      const previews = files.map(file => URL.createObjectURL(file));
      setAdditionalImagesPreview(previews);
    }
  };

  const removeMainImage = (setFieldValue: any) => {
    setFieldValue("main_image", null);
    setMainImagePreview(null);
  };

  const removeAdditionalImage = (index: number, setFieldValue: any, values: ProductFormData) => {
    if (values.images) {
      const newImages = values.images.filter((_, i) => i !== index);
      setFieldValue("images", newImages);
      const newPreviews = additionalImagesPreview.filter((_, i) => i !== index);
      setAdditionalImagesPreview(newPreviews);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-black rounded-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Product</h1>
      
      <Formik
        initialValues={{
          name: "",
          description: "",
          basePrice: "",
          salePrice: "",
          c_id: "",
          dimensions: "",
          specifications: "",
          features: "",
          weight: "",
          main_image: null,
          images: null,
          bestSeller: false,
        }}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Field
                  id="name"
                  name="name"
                  as={Input}
                  placeholder="Enter product name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Field
                  id="description"
                  name="description"
                  as={Textarea}
                  placeholder="Enter product description"
                  rows={4}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Base Price */}
              <div>
                <Label htmlFor="basePrice">Base Price *</Label>
                <Field
                  id="basePrice"
                  name="basePrice"
                  as={Input}
                  type="text"
                  placeholder="0.00"
                />
                <ErrorMessage
                  name="basePrice"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Sale Price */}
              <div>
                <Label htmlFor="salePrice">Sale Price</Label>
                <Field
                  id="salePrice"
                  name="salePrice"
                  as={Input}
                  type="text"
                  placeholder="0.00"
                />
                <ErrorMessage
                  name="salePrice"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Category ID */}
              <div>
                <Label htmlFor="c_id">Category ID *</Label>
                <Field
                  id="c_id"
                  name="c_id"
                  as={Input}
                  placeholder="Enter category ID"
                />
                <ErrorMessage
                  name="c_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Best Seller */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bestSeller"
                  checked={values.bestSeller}
                  onCheckedChange={(checked) => setFieldValue("bestSeller", checked)}
                />
                <Label htmlFor="bestSeller">Best Seller</Label>
              </div>

              {/* Dimensions (JSON) */}
              <div className="md:col-span-2">
                <Label htmlFor="dimensions">Dimensions (JSON) *</Label>
                <Field
                  id="dimensions"
                  name="dimensions"
                  as={Textarea}
                  placeholder='{"length": 39, "width": 28, "height": 3, "unit": "cm"}'
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter dimensions as JSON format with length, width, height, and unit
                </p>
                <ErrorMessage
                  name="dimensions"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Specifications (JSON) */}
              <div className="md:col-span-2">
                <Label htmlFor="specifications">Specifications (JSON) *</Label>
                <Field
                  id="specifications"
                  name="specifications"
                  as={Textarea}
                  placeholder='[{"key":"CPU","value":"Intel i9"},{"key":"RAM","value":"32GB"}]'
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter specifications as JSON array with key-value pairs
                </p>
                <ErrorMessage
                  name="specifications"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Features (JSON) */}
              <div className="md:col-span-2">
                <Label htmlFor="features">Features (JSON) *</Label>
                <Field
                  id="features"
                  name="features"
                  as={Textarea}
                  placeholder='["Backlit Keyboard","120Hz Screen"]'
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter features as JSON array of strings
                </p>
                <ErrorMessage
                  name="features"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Weight (JSON) */}
              <div className="md:col-span-2">
                <Label htmlFor="weight">Weight (JSON) *</Label>
                <Field
                  id="weight"
                  name="weight"
                  as={Textarea}
                  placeholder='{"value": 2.2, "unit": "kg"}'
                  rows={2}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter weight as JSON with value and unit
                </p>
                <ErrorMessage
                  name="weight"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Main Image */}
              <div className="md:col-span-2">
                <Label htmlFor="main_image">Main Image *</Label>
                <Input
                  id="main_image"
                  name="main_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainImageChange(e, setFieldValue)}
                />
                {mainImagePreview && (
                  <div className="mt-4 relative inline-block">
                    <Image
                      src={mainImagePreview}
                      alt="Main image preview"
                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => removeMainImage(setFieldValue)}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <ErrorMessage
                  name="main_image"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Additional Images */}
              <div className="md:col-span-2">
                <Label htmlFor="images">Additional Images *</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleAdditionalImagesChange(e, setFieldValue)}
                />
                {additionalImagesPreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {additionalImagesPreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Additional image ${index + 1}`}
                          width={150}
                          height={150}
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => removeAdditionalImage(index, setFieldValue, values)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {isSubmitting || isLoading ? "Creating Product..." : "Create Product"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}