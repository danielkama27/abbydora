"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = () => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then(setCollections);
  };

  const openModal = (collection?: any) => {
    if (collection) {
      setEditing(collection);
      setFormData({ name: collection.name, description: collection.description || "", image: collection.image || "" });
    } else {
      setEditing(null);
      setFormData({ name: "", description: "", image: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/collections/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setShowModal(false);
    fetchCollections();
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/collections/${id}`, { method: "DELETE" });
    fetchCollections();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-abby-black">Collections</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-abby-black text-abby-off-white px-4 py-2 text-sm font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection: any) => (
          <div key={collection.id} className="bg-white rounded-sm border border-abby-stone overflow-hidden">
            <div className="aspect-[4/3] bg-abby-stone relative">
              {collection.image && <img src={collection.image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg font-semibold text-abby-black mb-1">{collection.name}</h3>
              <p className="text-sm text-abby-black/50 mb-4 line-clamp-2">{collection.description || "No description"}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(collection)} className="p-2 text-abby-black/50 hover:text-abby-gold transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteCollection(collection.id)} className="p-2 text-abby-black/50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-abby-black">{editing ? "Edit Collection" : "Add Collection"}</h2>
              <button onClick={() => setShowModal(false)} className="text-abby-black/50 hover:text-abby-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-abby-black mb-1">Name</label><input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold" /></div>
              <div><label className="block text-sm font-medium text-abby-black mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold resize-none" /></div>
              <div><label className="block text-sm font-medium text-abby-black mb-1">Image URL</label><input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold" /></div>
              <button type="submit" className="w-full bg-abby-black text-abby-off-white py-3 font-semibold uppercase tracking-wider text-sm">{editing ? "Update" : "Create"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
