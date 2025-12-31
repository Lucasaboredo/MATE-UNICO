"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromStrapi } from "@/lib/api";

export default function PerfilPage() {
    const { user, token, logout, loading, login } = useAuth();
    const router = useRouter();

    const [tab, setTab] = useState<"compras" | "datos">("compras");
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Estados del Formulario
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion_facturacion: "",
        numero_facturacion: "",
        ciudad_facturacion: "",
        provincia_facturacion: "",
        cp_facturacion: "",
        direccion: "",
        numero: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    // ✅ Helper para imágenes
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.png"; 
        // Si ya viene completa (https...) la dejamos, si es relativa le pegamos el backend
        if (url.startsWith("http")) return url;
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
        return `${STRAPI_URL}${url}`;
    };

    // ✅ Helper para fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || "",
                apellido: user.apellido || "",
                email: user.email || "",
                telefono: user.telefono || "",
                direccion_facturacion: user.direccion_facturacion || "",
                numero_facturacion: user.numero_facturacion || "",
                ciudad_facturacion: user.ciudad_facturacion || "",
                provincia_facturacion: user.provincia_facturacion || "",
                cp_facturacion: user.cp_facturacion || "",
                direccion: user.direccion || "",
                numero: user.numero || "",
                ciudad: user.ciudad || "",
                provincia: user.provincia || "",
                codigoPostal: user.codigoPostal || "",
            });
        }
    }, [user]);

    useEffect(() => {
        const loadOrders = async () => {
            if (!token) return;
            try {
                const res = await fetchFromStrapi("/ordens/mis-ordenes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error cargando órdenes", error);
            } finally {
                setLoadingOrders(false);
            }
        };
        if (user) loadOrders();
    }, [token, user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"}/api/perfil/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Error al actualizar");
            const updatedUser = await res.json();

            login(token!, updatedUser);
            setMsg("¡Datos guardados correctamente!");
        } catch (error) {
            setMsg("Hubo un error al guardar los datos.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="w-full h-60 md:h-80 relative mb-8">
                <img src="/banner-perfil.png" alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h2 className="text-white text-3xl md:text-4xl font-bold px-4 text-center tracking-wide">
                        
                    </h2>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6">
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button 
                        onClick={() => setTab("compras")} 
                        className={`pb-3 text-sm font-bold tracking-wider transition-colors ${tab === "compras" ? "border-b-2 border-[#2F4A2D] text-[#2F4A2D]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        MIS COMPRAS
                    </button>
                    <button 
                        onClick={() => setTab("datos")} 
                        className={`pb-3 text-sm font-bold tracking-wider transition-colors ${tab === "datos" ? "border-b-2 border-[#2F4A2D] text-[#2F4A2D]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        MIS DATOS
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                        {tab === "compras" ? (
                            loadingOrders ? (
                                <div className="text-center py-10 animate-pulse text-gray-400">Cargando tus compras...</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-2">Aún no has realizado compras.</p>
                                    <button onClick={() => router.push("/productos")} className="text-[#2F4A2D] font-bold hover:underline">
                                        Ir al catálogo
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((o) => (
                                        <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                                            {/* Cabecera de la Orden */}
                                            <div className="bg-[#F8F6F1] px-5 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orden #{o.id}</span>
                                                    <span className="text-sm font-medium text-gray-800">{formatDate(o.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                        o.estado === 'pagado' ? 'bg-green-100 text-green-700' :
                                                        o.estado === 'fallido' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {o.estado || 'Pendiente'}
                                                    </span>
                                                    <span className="font-bold text-lg text-[#2F4A2D]">
                                                        ${Number(o.total || 0).toLocaleString("es-AR")}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Lista de Productos */}
                                            <div className="p-5">
                                                {o.items && Array.isArray(o.items) && o.items.map((item: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
                                                        {/* Foto del producto */}
                                                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <img 
                                                                src={getImageUrl(item.imagenUrl)} 
                                                                alt={item.nombre} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        
                                                        {/* Info del item */}
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-800 text-sm leading-tight mb-1">
                                                                {item.nombre}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.cantidad} x ${Number(item.precioUnitario).toLocaleString("es-AR")}
                                                            </p>
                                                        </div>

                                                        {/* Botón rápido para opinar (opcional) */}
                                                        {o.estado === 'pagado' && (
                                                            <button 
                                                                onClick={() => router.push(`/productos/${item.slug}`)}
                                                                className="text-xs font-bold text-[#2F4A2D] hover:underline whitespace-nowrap"
                                                            >
                                                                Opinar
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
                                {/* ... FORMULARIO IGUAL QUE ANTES ... */}
                                {/* (Copia aquí el contenido del formulario que ya tenías, no cambió nada) */}
                                {/* Para ahorrar espacio, mantén tu bloque del formulario aquí */}
                                {/* 1. INFORMACIÓN PERSONAL (Facturación) */}
                                <div className="bg-white p-6 rounded-xl border shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-lg font-bold text-[#2F4A2D]">Información Personal</h3>
                                        <span className="text-gray-400 text-sm">👤 (Datos de Facturación)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE</label>
                                            <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Ej: Juan" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">APELLIDO</label>
                                            <input type="text" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Ej: Perez" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL</label>
                                            <input type="text" value={formData.email} disabled className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">TELÉFONO</label>
                                            <input type="text" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                    </div>
                                    {/* Dirección Personal */}
                                    <div className="border-t pt-4">
                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Domicilio de Facturación</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" value={formData.direccion_facturacion} onChange={(e) => setFormData({ ...formData, direccion_facturacion: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Calle" />
                                            <input type="text" value={formData.numero_facturacion} onChange={(e) => setFormData({ ...formData, numero_facturacion: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Altura" />
                                            <input type="text" value={formData.ciudad_facturacion} onChange={(e) => setFormData({ ...formData, ciudad_facturacion: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Ciudad" />
                                            <input type="text" value={formData.cp_facturacion} onChange={(e) => setFormData({ ...formData, cp_facturacion: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="CP" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. DATOS DE ENVÍO */}
                                <div className="bg-white p-6 rounded-xl border shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-lg font-bold text-[#2F4A2D]">Datos de Envío</h3>
                                        <span className="text-gray-400 text-sm">🚚 (Dónde recibes tus paquetes)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">CALLE</label>
                                            <input type="text" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="Calle de entrega" />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">ALTURA</label>
                                            <input type="text" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="1234" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">CIUDAD</label>
                                            <input type="text" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">PROVINCIA</label>
                                            <input type="text" value={formData.provincia} onChange={(e) => setFormData({ ...formData, provincia: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">CÓDIGO POSTAL</label>
                                            <input type="text" value={formData.codigoPostal} onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {msg && <p className={`text-center font-medium ${msg.includes("error") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}

                                <button type="submit" disabled={saving} className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-lg hover:bg-[#1e331c] transition-colors shadow-md">
                                    {saving ? "Guardando..." : "Guardar Todos los Cambios"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-[#F8F6F1] p-6 rounded-xl border border-[#E6E2DB] sticky top-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#2F4A2D] text-white flex items-center justify-center font-bold text-lg">
                                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2F4A2D] leading-tight">{user.nombre ? `${user.nombre} ${user.apellido}` : user.username}</h3>
                                    <p className="text-xs text-gray-500">Miembro desde {new Date(user.createdAt).getFullYear()}</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                                <span className="text-lg"></span> {user.email}
                            </p>

                            <button onClick={logout} className="w-full border border-red-200 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}