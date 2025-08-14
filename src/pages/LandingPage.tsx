import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { API_URI } from "../enums/enums";
import { Property } from "../services/propertyService";
import { PropertyImage } from "../interfaces/IPropertyImage";

export default function LandingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyImages, setPropertyImages] = useState<
    Record<string, PropertyImage[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);

  const [propertyForm, setPropertyForm] = useState({
    name: "",
    address: "",
    price: "",
    codeInternal: "",
    year: "",
    idOwner: "",
  });

  const [imageForm, setImageForm] = useState({
    idProperty: "",
    file: "",
    enabled: true,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Property[]>(API_URI.docker + "/properties");
      setProperties(res.data);

      // Fetch images for each property
      const imagesMap: Record<string, PropertyImage[]> = {};
      for (const property of res.data) {
        try {
          const imgRes = await axios.get<PropertyImage[]>(
            `${API_URI.docker}/PropertyImages/property/${property.id}`
          );
          imagesMap[property.id] = imgRes.data;
        } catch {
          imagesMap[property.id] = [];
        }
      }
      setPropertyImages(imagesMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(API_URI.docker + "/Properties", {
        ...propertyForm,
        price: Number(propertyForm.price),
        year: Number(propertyForm.year),
      })
      .then(() => {
        alert("Property created successfully");
        setPropertyForm({
          name: "",
          address: "",
          price: "",
          codeInternal: "",
          year: "",
          idOwner: "",
        });
        setShowPropertyForm(false);
        fetchProperties();
      })
      .catch((err) => alert("Error creating property: " + err.message));
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(API_URI.docker + "/PropertyImages", imageForm)
      .then(() => {
        alert("Property image added successfully");
        setImageForm({
          idProperty: "",
          file: "",
          enabled: true,
        });
        setShowImageForm(false);
        fetchProperties(); // Refresh to include new images
      })
      .catch((err) => alert("Error adding image: " + err.message));
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 5);
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
              const images = propertyImages[property.id] || [];
              const firstImage = images.length > 0 ? images[0].file : null;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {images.length > 0 ? (
                    <div className="mb-3">
                      <Slider {...sliderSettings}>
                        {images.map((img) => (
                          <div key={img.id}>
                            <img
                              src={img.file}
                              alt={property.name}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {property.name}
                    </h2>
                    {property.id && (
                      <p className="text-gray-500 text-xs mb-2">
                        <span className="font-semibold">ID:</span> {property.id}
                      </p>
                    )}
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

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => {
              setShowPropertyForm((prev) => !prev);
              scrollToBottom();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ➕ Add Property
          </button>
          <button
            onClick={() => {
              setShowImageForm((prev) => !prev);
              scrollToBottom();
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🖼 Add Property Image
          </button>
        </div>

        {/* Property Form */}
        {showPropertyForm && (
          <form
            onSubmit={handlePropertySubmit}
            className="mt-6 bg-white shadow-md rounded-lg p-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full rounded"
              value={propertyForm.name}
              onChange={(e) =>
                setPropertyForm({ ...propertyForm, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-2 w-full rounded"
              value={propertyForm.address}
              onChange={(e) =>
                setPropertyForm({ ...propertyForm, address: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2 w-full rounded"
              value={propertyForm.price}
              onChange={(e) =>
                setPropertyForm({ ...propertyForm, price: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Code Internal"
              className="border p-2 w-full rounded"
              value={propertyForm.codeInternal}
              onChange={(e) =>
                setPropertyForm({
                  ...propertyForm,
                  codeInternal: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Year"
              className="border p-2 w-full rounded"
              value={propertyForm.year}
              onChange={(e) =>
                setPropertyForm({ ...propertyForm, year: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Owner ID"
              className="border p-2 w-full rounded"
              value={propertyForm.idOwner}
              onChange={(e) =>
                setPropertyForm({ ...propertyForm, idOwner: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Property
            </button>
          </form>
        )}

        {/* Property Image Form */}
        {showImageForm && (
          <form
            onSubmit={handleImageSubmit}
            className="mt-6 bg-white shadow-md rounded-lg p-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Property ID"
              className="border p-2 w-full rounded"
              value={imageForm.idProperty}
              onChange={(e) =>
                setImageForm({ ...imageForm, idProperty: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="File URL"
              className="border p-2 w-full rounded"
              value={imageForm.file}
              onChange={(e) =>
                setImageForm({ ...imageForm, file: e.target.value })
              }
              required
            />
            <select
              className="border p-2 w-full rounded"
              value={imageForm.enabled.toString()}
              onChange={(e) =>
                setImageForm({
                  ...imageForm,
                  enabled: e.target.value === "true",
                })
              }
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Save Image
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
