'use client';

import { useEffect, useState } from 'react';
import { BACKEND } from '@/src/types/commons';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface ApiDashboard {
  resumen: {
    ventas: number;
    ingresos: number;
    clientes: number;
  };
  actividad_reciente: {
    id: number;
    descripcion: string;
    fecha: string;
    estado: 'completado' | 'pendiente' | 'fallido';
  }[];
}

export default function DashboardAdmin() {
  const [data, setData] = useState<ApiDashboard>({
    resumen: { ventas: 0, ingresos: 0, clientes: 0 },
    actividad_reciente: [],
  });

  useEffect(() => {
    fetch(`${BACKEND}/dashboard/`)
      .then((res) => res.json())
      .then((json: ApiDashboard) => setData(json))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error('Error al obtener el dashboard:', err.message);
        }
      });
  }, []);

  const resumenItems = [
    {
      titulo: 'Ventas',
      valor: data.resumen.ventas,
    },
    {
      titulo: 'Ingresos',
      valor: `$${parseFloat(String(data.resumen.ingresos)).toFixed(2)}`,
    },
    {
      titulo: 'Clientes',
      valor: data.resumen.clientes,
    },
  ];

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

      <div className="md:col-span-2 lg:col-span-3 grid gap-4">
        <h3 className="text-lg font-semibold">Actividad reciente</h3>
        {data.actividad_reciente.map((actividad) => (
          <Card key={actividad.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h4 className="text-md font-semibold">{actividad.descripcion}</h4>
                <p className="text-sm text-muted-foreground">{actividad.fecha}</p>
              </div>
              <Badge
                variant={
                  actividad.estado === 'completado'
                    ? 'default'
                    : actividad.estado === 'pendiente'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {actividad.estado}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
