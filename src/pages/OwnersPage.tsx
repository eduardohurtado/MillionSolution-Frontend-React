import { useEffect, useState } from "react";
import axios from "axios";

interface Owner {
  id: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    address: "",
    photo: "",
    birthday: "",
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    axios
      .get<Owner[]>("http://localhost:5001/api/Owners")
      .then((res) => {
        setOwners(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching owners:", err);
        setLoading(false);
      });
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/api/Owners", {
        ...ownerForm,
        birthday: new Date(ownerForm.birthday).toISOString(),
      })
      .then(() => {
        alert("Owner created successfully");
        setOwnerForm({
          name: "",
          address: "",
          photo: "",
          birthday: "",
        });
        setShowOwnerForm(false);
        fetchOwners();
      })
      .catch((err) => alert("Error creating owner: " + err.message));
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading owners...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 Owners</h1>

        {owners.length === 0 ? (
          <div className="text-gray-500">No owners found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {owners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={owner.photo}
                  alt={owner.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {owner.name}
                  </h2>
                  <p className="text-gray-500 text-xs mb-2">
                    <span className="font-semibold">ID:</span> {owner.id}
                  </p>
                  <p className="text-gray-600">{owner.address}</p>
                  <p className="text-gray-500 text-sm">
                    Birthday: {new Date(owner.birthday).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10">
          <button
            onClick={() => setShowOwnerForm((prev) => !prev)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ➕ Add Owner
          </button>
        </div>

        {/* Owner Form */}
        {showOwnerForm && (
          <form
            onSubmit={handleOwnerSubmit}
            className="mt-6 bg-white shadow-md rounded-lg p-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full rounded"
              value={ownerForm.name}
              onChange={(e) =>
                setOwnerForm({ ...ownerForm, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-2 w-full rounded"
              value={ownerForm.address}
              onChange={(e) =>
                setOwnerForm({ ...ownerForm, address: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Photo URL"
              className="border p-2 w-full rounded"
              value={ownerForm.photo}
              onChange={(e) =>
                setOwnerForm({ ...ownerForm, photo: e.target.value })
              }
              required
            />
            <input
              type="date"
              placeholder="Birthday"
              className="border p-2 w-full rounded"
              value={ownerForm.birthday}
              onChange={(e) =>
                setOwnerForm({ ...ownerForm, birthday: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Owner
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
