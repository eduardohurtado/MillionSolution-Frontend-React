import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal?: string;
  year?: number;
  idOwner: string;
}

interface PropertyImage {
  id: string;
  idProperty: string;
  file: string; // URL or base64
  enabled: boolean;
}

const LandingPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Record<string, PropertyImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Property[]>("http://localhost:5001/api/properties")
      .then((res) => {
        setProperties(res.data);

        // Fetch images for each property
        res.data.forEach((property) => {
          axios
            .get<PropertyImage[]>(
              `http://localhost:5001/api/PropertyImages/property/${property.id}`
            )
            .then((imgRes) => {
              setImages((prev) => ({
                ...prev,
                [property.id]: imgRes.data.filter((img) => img.enabled),
              }));
            })
            .catch((err) =>
              console.error(`Error fetching images for ${property.id}:`, err)
            );
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-500">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🏠 Available Properties
        </h1>

        {properties.length === 0 ? (
          <div className="text-gray-500">No properties found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const propertyImages = images[property.id] || [];

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {propertyImages.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {propertyImages.map((img) => (
                        <div key={img.id}>
                          <img
                            src={img.file}
                            alt={property.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {property.name}
                    </h2>
                    <p className="text-gray-600">{property.address}</p>
                    <p className="mt-2 text-gray-900 font-bold">
                      ${property.price.toLocaleString()}
                    </p>
                    {property.year && (
                      <p className="text-gray-500 text-sm">
                        Year: {property.year}
                      </p>
                    )}
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
