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
                    "Authorization": `Bearer ${token}`,
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
        <div className="min-h-screen bg-[#F9F7F2] pb-20">
            
            {/* 1. BANNER LIMPIO Y CENTRADO */}
            <div className="w-full h-[150px] md:h-[335px] bg-[#4A3E36] overflow-hidden relative">
                <img 
                    src="/banner-perfil.png" 
                    alt="Banner Perfil" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="container mx-auto px-4 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: TARJETA DE PERFIL (Sticky) */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center sticky top-24">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#2F4A2D] text-white flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-sm">
                                {user.nombre ? user.nombre.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                            </div>
                            
                            <h3 className="font-bold text-xl text-gray-800 mb-1">
                                {user.nombre ? `${user.nombre} ${user.apellido}` : user.username}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">{user.email}</p>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                    <span>Miembro desde</span>
                                    <span className="font-semibold">{new Date(user.createdAt).getFullYear()}</span>
                                </div>
                            </div>

                            <button 
                                onClick={logout} 
                                className="mt-6 w-full py-2.5 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: PESTAÑAS Y CONTENIDO */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 min-h-[500px]">
                            
                            {/* TABS DE NAVEGACIÓN */}
                            <div className="flex border-b border-gray-100 mb-8 gap-8">
                                <button 
                                    onClick={() => setTab("compras")} 
                                    className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
                                        tab === "compras" 
                                        ? "text-[#2F4A2D]" 
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    MIS COMPRAS
                                    {tab === "compras" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2F4A2D] rounded-t-full" />}
                                </button>
                                <button 
                                    onClick={() => setTab("datos")} 
                                    className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
                                        tab === "datos" 
                                        ? "text-[#2F4A2D]" 
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    MIS DATOS
                                    {tab === "datos" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2F4A2D] rounded-t-full" />}
                                </button>
                            </div>

                            {/* CONTENIDO: MIS COMPRAS */}
                            {tab === "compras" && (
                                loadingOrders ? (
                                    <div className="text-center py-20 text-gray-400 animate-pulse">Cargando historial...</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="text-4xl mb-3 opacity-30">📦</div>
                                        <p className="text-gray-500 font-medium mb-4">Aún no has realizado compras.</p>
                                        <button onClick={() => router.push("/productos")} className="text-[#2F4A2D] font-bold text-sm hover:underline">
                                            Ir al catálogo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {orders.map((o) => (
                                            <div key={o.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#2F4A2D]/30 transition-colors">
                                                <div className="bg-[#F9F9F9] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase block mb-0.5">Orden #{o.id}</span>
                                                        <span className="text-sm font-bold text-gray-800">{formatDate(o.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                            o.estado === 'pagado' ? 'bg-green-100 text-green-700' :
                                                            o.estado === 'fallido' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {o.estado || 'Pendiente'}
                                                        </span>
                                                        <span className="font-bold text-[#2F4A2D]">${Number(o.total || 0).toLocaleString("es-AR")}</span>
                                                    </div>
                                                </div>
                                                <div className="p-6 grid gap-4">
                                                    {o.items && Array.isArray(o.items) && o.items.map((item: any, index: number) => (
                                                        <div key={index} className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                                <img src={getImageUrl(item.imagenUrl || item.imagen || item.product?.imagen?.url || item.producto?.imagen?.url || "")} alt={item.nombre} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-800">{item.nombre}</p>
                                                                <p className="text-xs text-gray-500">{item.cantidad} x ${Number(item.precioUnitario || item.precio || 0).toLocaleString("es-AR")}</p>
                                                            </div>
                                                            {o.estado === 'pagado' && (
                                                                <button 
                                                                    onClick={() => router.push(`/productos/${item.slug || item.product?.slug || item.producto?.slug || ""}`)}
                                                                    className="text-xs font-bold text-[#2F4A2D] hover:underline"
                                                                >
                                                                    Opinar
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {o.estado !== 'pagado' && (
                                                    <div className="bg-[#FFF5F5] px-6 py-3 border-t border-red-50 flex justify-end">
                                                        <button 
                                                            onClick={async () => {
                                                                if (!window.confirm("¿Seguro que querés cancelar esta orden?")) return;
                                                                try {
                                                                    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"}/api/ordens/mis-ordenes/${o.id}`, {
                                                                        method: "DELETE",
                                                                        headers: { Authorization: `Bearer ${token}` },
                                                                    });
                                                                    if (!res.ok) throw new Error("Error al eliminar");
                                                                    setOrders(orders.filter(order => order.id !== o.id));
                                                                } catch (error) {
                                                                    alert("Hubo un error al eliminar la orden");
                                                                }
                                                            }}
                                                            className="text-lg text-red-600 hover:text-red-800 transition-colors flex items-center justify-center p-2 rounded-md hover:bg-red-50"
                                                            title="Eliminar orden"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* CONTENIDO: MIS DATOS (Formulario Mejorado) */}
                            {tab === "datos" && (
                                <form onSubmit={handleSave} className="animate-in fade-in space-y-8">
                                    
                                    {/* Sección Personal */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                            <span>👤</span> Información Personal
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Nombre</label>
                                                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" placeholder="Tu nombre" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Apellido</label>
                                                <input type="text" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" placeholder="Tu apellido" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Email</label>
                                                <input type="text" value={formData.email} disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Teléfono</label>
                                                <input type="text" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" placeholder="Tu celular" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección Envío */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                            <span>📍</span> Dirección de Envío Predeterminada
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Calle</label>
                                                <input type="text" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Altura / Depto</label>
                                                <input type="text" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Ciudad</label>
                                                <input type="text" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Provincia</label>
                                                <input type="text" value={formData.provincia} onChange={(e) => setFormData({ ...formData, provincia: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Código Postal</label>
                                                <input type="text" value={formData.codigoPostal} onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D] focus:border-transparent transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensaje y Botón */}
                                    <div className="pt-4">
                                        {msg && (
                                            <div className={`text-center mb-4 p-3 rounded-lg text-sm font-bold ${msg.includes("error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                                                {msg}
                                            </div>
                                        )}
                                        <button 
                                            type="submit" 
                                            disabled={saving} 
                                            className="w-full bg-[#2F4A2D] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e331c] transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                                        >
                                            {saving ? "Guardando..." : "Guardar mis datos"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}