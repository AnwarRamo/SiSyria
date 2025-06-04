import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const features = [
  {
    title: "High Quality",
    description: "We ensure top quality in every product we offer.",
  },
  {
    title: "Fast Delivery",
    description: "Quick and secure delivery across all regions.",
  },
  {
    title: "Secure Payments",
    description: "All transactions are encrypted and secure.",
  },
  {
    title: "Customer Support",
    description: "24/7 customer support to help you anytime.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-base font-semibold tracking-wide text-[#115d5a] uppercase">
          What We Offer
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Our Core Features
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Discover why our users love shopping with us.
        </p>
      </div>

      <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <CheckCircleIcon className="h-8 w-8 text-[#115d5a]" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-1 text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
