"use client";

import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { homeProductsData } from "@/utils/homeProductsData";
import { Button } from "@/components/ui/button";

import { ViewCategory } from "@/components/ViewCategory";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React from "react";

export const dynamic = 'force-dynamic';


const homeInstallationSchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string(),
  // imageUrl: Yup.string().url("Must be a valid URL").optional(),
  imageUrl: Yup.mixed().required("Image is required"),
});

const HomeInstallationPage = () => {
  const router = useRouter();
  const handleSubmit = async (values: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    console.log("values", values);
  };

  return (
    <div className="pt-20">
      <div className="relative w-full h-[40vh] sm:h-[70vh]">
        <Image
          src="/Rectangle 70.png"
          alt="Banner"
          fill
          className="object-fit"
        />
        <img
          src="/Demonoid text roation.gif"
          alt="Loading..."
          className="rounded-xl absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 pt-6 w-40"
        />
      </div>

      <div className="bg-white my-8">
        <h2 className="text-xl text-black text-center font-semibold py-3">
          Home Installation (At-Home Car Accessory Fitting)
        </h2>
      </div>

      <div className="my-10">
        <div className="sm:w-[80%] w-[95%]  mx-auto">
          <p className="text-white justify-center sm:text-start w-[90%] sm:w-[60%] pb-16">
            Buy car accessories on Demonoid and get professional home installation at your doorstep. Verified technicians,
            fixed pricing, warranty, and pan‑city coverage. Book your slot in minutes.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* First image - always visible */}
            <div className="relative h-[220px] sm:h-[230px] w-full rounded-lg overflow-hidden">
              <Image
                src="/installation1.png"
                alt="Image 1"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {/* Second image - always visible */}
            <div className="relative h-[220px] sm:h-[230px] w-full rounded-lg overflow-hidden">
              <Image
                src="/installation2.png"
                alt="Image 2"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {/* Third image - only visible on md and up */}
            <div className="relative h-[220px] sm:h-[230px] w-full rounded-lg overflow-hidden hidden md:block">
              <Image
                src="/installation3.png"
                alt="Image 3"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl text-[#84FF00]  py-9">How It Works</h2>

            <div className="flex items-start gap-3 text-white p-4 rounded-lg">
              {/* Icon */}
              <div className="flex relative items-center justify-center w-8 h-8 rounded bg-red-700">
                <Image src="/installation-log.png" alt="bolt" fill />
              </div>
              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold">Choose Product</h3>
                <p className="text-sm text-gray-400">
                  Pick accessories on Demonoid (seat covers, dash cam, reverse cam, infotainment, ambient lights, etc.).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white p-4 rounded-lg">
              {/* Icon */}
              <div className="flex relative items-center justify-center w-8 h-8 rounded bg-red-700">
                <Image src="/installation-log.png" alt="bolt" fill />
              </div>
              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold">Choose Product</h3>
                <p className="text-sm text-gray-400">
                  Enter pincode to confirm doorstep installation availability & price.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white p-4 rounded-lg">
              {/* Icon */}
              <div className="flex relative items-center justify-center w-8 h-8 rounded bg-red-700">
                <Image src="/installation-log.png" alt="bolt" fill />
              </div>
              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold">Choose Product</h3>
                <p className="text-sm text-gray-400">
                  Pick a date & time window.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white p-4 rounded-lg">
              {/* Icon */}
              <div className="flex relative items-center justify-center w-8 h-8 rounded bg-red-700">
                <Image src="/installation-log.png" alt="bolt" fill />
              </div>
              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold">Choose Product</h3>
                <p className="text-sm text-gray-400">
                  Track name, phone & live status via SMS/WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white p-4 rounded-lg">
              {/* Icon */}
              <div className="flex relative items-center justify-center w-8 h-8 rounded bg-red-700">
                <Image src="/installation-log.png" alt="bolt" fill />
              </div>
              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold">Choose Product</h3>
                <p className="text-sm text-gray-400">
                  Clean, professional fitment at home/office parking.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-end justify-center py-10 ">
              <div className="bg-[#E5E5E5]  p-6 rounded-md shadow-md w-full max-w-md">
                <h3 className="text-black font-semibold mb-4">Check Serviceability</h3>
                <Formik
                  initialValues={{ name: "", description: "", imageUrl: "" }}
                  validationSchema={homeInstallationSchema}
                  onSubmit={() => { }}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="flex items-end gap-2">
                      <div className="flex-1">
                        <Field
                          id="pincode"
                          name="pincode"
                          // as={Input}
                          placeholder="Enter pincode"
                          className="w-full border-b border-black bg-transparent px-2 py-1 focus:outline-none"
                        />
                        <ErrorMessage
                          name="pincode"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gray-700 text-white px-4 py-2 text-sm"
                      >
                        {isSubmitting ? "Submitting..." : "Create Category"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
              <Button onClick={() => { router.push("/installation-details") }} className="bg-white text-black px-6 py-3 rounded shadow-md">
                Book Home Installation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInstallationPage;