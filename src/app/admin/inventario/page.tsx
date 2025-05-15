'use client';

import { useEffect, useState } from 'react';
import { BACKEND } from '@/src/types/commons'
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ApiProducto {
  id: number;
  nombre: string;
  stock: number;
  categoria: string;
}

interface ApiResumen {
  total_productos: number;
  valor_inventario: number;
  stock_bajo: number;
}

export default function InventarioAdmin() {
  const [productos, setProductos] = useState<ApiProducto[]>([]);
  const [resumen, setResumen] = useState<ApiResumen>({
    total_productos: 0,
    valor_inventario: 0,
    stock_bajo: 0,
  });

  useEffect(() => {
    fetch(`${BACKEND}/producto/inventario/`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.productos || []);
        setResumen(data.resumen || resumen);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error('Error al obtener inventario:', err.message);
        }
      });
  }, []);

  const resumenItems = [
    {
      titulo: 'Total de productos',
      valor: resumen.total_productos,
    },
    {
      titulo: 'Valor del inventario',
      valor: `$${parseFloat(String(resumen.valor_inventario)).toFixed(2)}`,
    },
    {
      titulo: 'Stock bajo',
      valor: resumen.stock_bajo,
    },
  ];

  const productosPorCategoria = productos.reduce<Record<string, number>>((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});

  const dataGrafico = Object.entries(productosPorCategoria).map(([categoria, cantidad]) => ({
    categoria,
    cantidad,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      {resumenItems.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <h3 className="text-sm text-muted-foreground">{item.titulo}</h3>
            <p className="text-2xl font-bold">{item.valor}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-3">
        <CardContent className="p-4">
          <h3 className="text-sm text-muted-foreground mb-2">Productos por categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataGrafico}>
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-3 grid gap-4">
        <h3 className="text-lg font-semibold">Productos</h3>
        {productos.map((producto) => (
          <Card key={producto.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h4 className="text-md font-semibold">{producto.nombre}</h4>
                <p className="text-sm text-muted-foreground">{producto.categoria}</p>
              </div>
              <Badge variant={producto.stock < 5 ? 'destructive' : 'default'}>
                Stock: {producto.stock}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
