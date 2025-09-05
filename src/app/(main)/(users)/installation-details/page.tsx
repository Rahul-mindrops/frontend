"use client";

import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React from "react";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';


const homeInstallationSchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string(),
  // imageUrl: Yup.string().url("Must be a valid URL").optional(),
  imageUrl: Yup.mixed().required("Image is required"),
});

const InstallationDetailsPage = () => {
  const handleSubmit = async (values: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    console.log("values", values);
  };

  return (
    <div className="pt-20">

      <div className="w-full h-[40vh] sm:h-[40vh] flex items-center justify-between px-20">
        <div className="flex-1" />
        <div className="relative h-full w-[60vw] flex items-center justify-center">
          <Image
            src="/installation-details.png"
            alt="Banner"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1" />
      </div>

      <div className="bg-white my-8">
        <h2 className="text-xl text-black text-center font-semibold py-3">
          Schedule Installation / Fill The Form Below
        </h2>
      </div>

      <div className="my-10">
        <div className="sm:w-[80%] w-[95%]  mx-auto">

          <div>

            <div className="min-h-screen flex justify-center items-center p-8">
              <Formik
                initialValues={{ name: "", description: "", imageUrl: "" }}
                validationSchema={homeInstallationSchema}
                onSubmit={() => { }}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form className=" text-white w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="flex flex-col gap-4">
                        <label>
                          Full Name
                          <Field
                            name="fullName"
                            type="text"
                            placeholder="Enter Your Full Name"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                          <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                        </label>

                        <label>
                          Mobile Number
                          <Field
                            name="mobile"
                            type="text"
                            placeholder="+91xxxxxxxxxx"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          Alternate Mobile Number
                          <Field
                            name="altMobile"
                            type="text"
                            placeholder="+91xxxxxxxxxx"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          Products
                          <Field
                            name="product"
                            as="select"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          >
                            <option value="">Pick Installation Car Parts</option>
                            <option value="dashcam">Dash Cam</option>
                            <option value="seatcover">Seat Covers</option>
                            <option value="infotainment">Infotainment</option>
                          </Field>
                        </label>

                        <label>
                          Pincode
                          <Field
                            name="pincode"
                            type="text"
                            placeholder="Enter 6-Digit Pincode"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          City
                          <Field
                            name="city"
                            type="text"
                            placeholder="Enter City Name"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col gap-4">
                        <label>
                          State
                          <Field
                            name="state"
                            type="text"
                            placeholder="Enter State Name"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          Full Address
                          <Field
                            name="address"
                            as="textarea"
                            placeholder="Enter Your Complete Address Including House No/Flat No, Street, Landmark"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded h-24"
                          />
                        </label>

                        <label>
                          Pick A Date
                          <Field
                            name="date"
                            type="date"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          Alternate Mobile Number
                          <Field
                            name="altMobile2"
                            type="text"
                            placeholder="+91xxxxxxxxxx"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>

                        <label>
                          Alternate Mobile Number
                          <Field
                            name="altMobile3"
                            type="text"
                            placeholder="+91xxxxxxxxxx"
                            className="w-full mt-1 px-3 py-2 bg-gray-200 text-black rounded"
                          />
                        </label>
                      </div>
                    </div>




                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label
                        htmlFor="description"
                        className="block text-sm pb-2 font-medium"
                      >
                        Description
                        <Field
                          id="description"
                          name="description"
                          as={Input}
                          placeholder="Enter description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </label>
                      <label
                        htmlFor="description"
                        className="block text-sm pb-2 font-medium"
                      >
                        Description
                        <Field
                          id="description"
                          name="description"
                          as={Input}
                          placeholder="Enter description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </label>
                      <label
                        htmlFor="description"
                        className="block text-sm pb-2 font-medium"
                      >
                        Description
                        <Field
                          id="description"
                          name="description"
                          as={Input}
                          placeholder="Enter description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </label>
                      <label
                        htmlFor="description"
                        className="block text-sm pb-2 font-medium"
                      >
                        Description
                        <Field
                          id="description"
                          name="description"
                          as={Input}
                          placeholder="Enter description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </label>
                      <label
                        htmlFor="description"
                        className="block text-sm pb-2 font-medium"
                      >
                        Description
                        <Field
                          id="description"
                          name="description"
                          as={Input}
                          placeholder="Enter description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </label>
                    </div> */}


                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gray-700 text-white mt-4 px-4 py-2 text-sm"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>

          </div>


        </div>
      </div>
    </div>
  );
};

export default InstallationDetailsPage;