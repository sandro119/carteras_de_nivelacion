'use client';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Input } from "../../../../components/ui/input";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { useParams } from "next/navigation";
import {updateProjectTotal} from "../../../../lib/actions/project";
import { addRecordsByProjectId, deleteRecordsByProjectId, getRecordsByProjectId } from "../../../../lib/actions/portfolioProject";
import { Button } from '@/components/ui/button';

type ExcelRow = {
  DESCRIPCION: string;
  'Abscisa (m)': number;
  'BI Cota_Negra (m)': number;
  'Eje Cota_Negra (m)': number;
  'BD Cota_Negra (m)': number;
  'BI Cota_Subrasante (m)': number;
  'Eje Cota_Subrasante (m)': number;
  'BD Cota_Subrasante (m)': number;
  'AC Izquierda (m)': number;
  'AC Derecha (m)': number;
  'Diferencia Izquierda': number;
  'Diferencia Eje': number;
  'Diferencia Derecha': number;
  'Área Corte Carril Izquierdo (m²)': number;
  'Área Corte Carril Derecho (m²)': number;
  'Volumen Corte Izquierdo (m³)'?: number;
  'Volumen Corte Derecho (m³)'?: number;

};

const parseNumber = (value: number) => parseFloat(value.toFixed(2));

export default function ExcelUploader() {
  const params = useParams();
  const id_proyecto:any = params.id_proyecto;
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [tableData, setTableData] = useState<ExcelRow[]>([]);
  const [uniqueDescripciones, setUniqueDescripciones] = useState([] as string[]);
  const [description, setDescription] = useState('');
  const [startAbscissa, setStartAbscissa] = useState('');
  const [endAbscissa, setEndAbscissa] = useState('');
  const [showError, setShowError] = useState(false);
  const [totalVolumenIzquierdo, setTotalVolumenIzquierdo] = useState(0);
  const [totalVolumenDerecho, setTotalVolumenDerecho] = useState(0);

  useEffect(() => {
    const getRecords = async () => {
    const data: any = await getRecordsByProjectId(id_proyecto);
    console.log(data);
    
    const descripciones: any = new Set();
    const jsonData: any = data.map((row: any) => {
      const {
        description: DESCRIPCION,
        abscisa: abscisa,
        biCotaNegra: biCotaNegra,
        ejeCotaNegra: ejeCotaNegra,
        bdCotaNegra: bdCotaNegra,
        biCotaSubrasante: biCotaSubrasante,
        ejeCotaSubrasante: ejeCotaSubrasante,
        bdCotaSubrasante: bdCotaSubrasante,
        acIzquierda: acIzquierda,
        acDerecha: acDerecha,
      } = row;

      // Guardar descripción única
      descripciones.add(DESCRIPCION);

      const diferenciaIzquierda = parseNumber(biCotaSubrasante - biCotaNegra);
      const diferenciaEje = parseNumber(ejeCotaSubrasante - ejeCotaNegra);
      const diferenciaDerecha = parseNumber(bdCotaSubrasante - bdCotaNegra);
      const areaCorteCarrilIzquierdo = parseNumber(acIzquierda * Math.abs(diferenciaEje + diferenciaIzquierda) / 2);
      const areaCorteCarrilDerecho = parseNumber(acDerecha * Math.abs(diferenciaDerecha + diferenciaEje) / 2);

      return {
          DESCRIPCION,
          'Abscisa (m)': abscisa,
          'BI Cota_Negra (m)': parseNumber(biCotaNegra),
          'Eje Cota_Negra (m)': parseNumber(ejeCotaNegra),
          'BD Cota_Negra (m)': parseNumber(bdCotaNegra),
          'BI Cota_Subrasante (m)': parseNumber(biCotaSubrasante),
          'Eje Cota_Subrasante (m)': parseNumber(ejeCotaSubrasante),
          'BD Cota_Subrasante (m)': parseNumber(bdCotaSubrasante),
          'AC Izquierda (m)': parseNumber(acIzquierda),
          'AC Derecha (m)': parseNumber(acDerecha),
          'Diferencia Izquierda': diferenciaIzquierda,
          'Diferencia Eje': diferenciaEje,
          'Diferencia Derecha': diferenciaDerecha,
          'Área Corte Carril Izquierdo (m²)': areaCorteCarrilIzquierdo,
          'Área Corte Carril Derecho (m²)': areaCorteCarrilDerecho,
      };
    });
    console.log(jsonData);
    setExcelData(jsonData);
    setUniqueDescripciones(Array.from(descripciones));
    }
    getRecords();
  }
  , []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData:any = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
        let jsonData2:any = jsonData.map((row: any) => {
          const {
            DESCRIPCION,
            'Abscisa (m)': abscisa,
            'BI Cota_Negra (m)': biCotaNegra,
            'Eje Cota_Negra (m)': ejeCotaNegra,
            'BD Cota_Negra (m)': bdCotaNegra,
            'BI Cota_Subrasante (m)': biCotaSubrasante,
            'Eje Cota_Subrasante (m)': ejeCotaSubrasante,
            'BD Cota_Subrasante (m)': bdCotaSubrasante,
            'AC Izquierda (m)': acIzquierda,
            'AC Derecha (m)': acDerecha,
        } = row;
        return  {
          description: DESCRIPCION,
          abscisa: abscisa,
          biCotaNegra: biCotaNegra,
          ejeCotaNegra: ejeCotaNegra,
          bdCotaNegra: bdCotaNegra,
          biCotaSubrasante: biCotaSubrasante,
          ejeCotaSubrasante: ejeCotaSubrasante,
          bdCotaSubrasante: bdCotaSubrasante,
          acIzquierda: acIzquierda,
          acDerecha: acDerecha,
        }
        });
        console.log(jsonData2);
        await deleteRecordsByProjectId(id_proyecto);
        await addRecordsByProjectId(id_proyecto, jsonData2);

        const descripciones: any = new Set();
    
        jsonData = jsonData.map((row: any) => {
            const {
                DESCRIPCION,
                'Abscisa (m)': abscisa,
                'BI Cota_Negra (m)': biCotaNegra,
                'Eje Cota_Negra (m)': ejeCotaNegra,
                'BD Cota_Negra (m)': bdCotaNegra,
                'BI Cota_Subrasante (m)': biCotaSubrasante,
                'Eje Cota_Subrasante (m)': ejeCotaSubrasante,
                'BD Cota_Subrasante (m)': bdCotaSubrasante,
                'AC Izquierda (m)': acIzquierda,
                'AC Derecha (m)': acDerecha,
            } = row;
    
            // Guardar descripción única
            descripciones.add(DESCRIPCION);
    
            const diferenciaIzquierda = parseNumber(biCotaSubrasante - biCotaNegra);
            const diferenciaEje = parseNumber(ejeCotaSubrasante - ejeCotaNegra);
            const diferenciaDerecha = parseNumber(bdCotaSubrasante - bdCotaNegra);
            const areaCorteCarrilIzquierdo = parseNumber(acIzquierda * Math.abs(diferenciaEje + diferenciaIzquierda) / 2);
            const areaCorteCarrilDerecho = parseNumber(acDerecha * Math.abs(diferenciaDerecha + diferenciaEje) / 2);
    
            return {
                DESCRIPCION,
                'Abscisa (m)': abscisa,
                'BI Cota_Negra (m)': parseNumber(biCotaNegra),
                'Eje Cota_Negra (m)': parseNumber(ejeCotaNegra),
                'BD Cota_Negra (m)': parseNumber(bdCotaNegra),
                'BI Cota_Subrasante (m)': parseNumber(biCotaSubrasante),
                'Eje Cota_Subrasante (m)': parseNumber(ejeCotaSubrasante),
                'BD Cota_Subrasante (m)': parseNumber(bdCotaSubrasante),
                'AC Izquierda (m)': parseNumber(acIzquierda),
                'AC Derecha (m)': parseNumber(acDerecha),
                'Diferencia Izquierda': diferenciaIzquierda,
                'Diferencia Eje': diferenciaEje,
                'Diferencia Derecha': diferenciaDerecha,
                'Área Corte Carril Izquierdo (m²)': areaCorteCarrilIzquierdo,
                'Área Corte Carril Derecho (m²)': areaCorteCarrilDerecho,
            };
        });

    
        setExcelData(jsonData);
        setUniqueDescripciones(Array.from(descripciones));
    };    
      reader.readAsArrayBuffer(file);
    },
  });

  const filterData = () => {
    const filteredData = excelData.filter((row) => {
      const abscisa = Number(row['Abscisa (m)']);
      return (
        row.DESCRIPCION.includes(description) &&
        (!startAbscissa || abscisa >= Number(startAbscissa)) &&
        (!endAbscissa || abscisa <= Number(endAbscissa))
      );
    });
  
    const hasPositiveDifference = filteredData.some(
      (row) =>
        row['Diferencia Izquierda'] > 0 ||
        row['Diferencia Eje'] > 0 ||
        row['Diferencia Derecha'] > 0
    );
  
    const updatedData = hasPositiveDifference
      ? filteredData
      : filteredData.map((row, index) => {
          const previousRow = index > 0 ? filteredData[index - 1] : null;
  
          const volCorteIzquierdo = previousRow
            ? parseFloat(((row['Abscisa (m)'] - previousRow['Abscisa (m)']) * ((row['Área Corte Carril Izquierdo (m²)'] + previousRow['Área Corte Carril Izquierdo (m²)']) / 2)).toFixed(2))
            : 0;
  
          const volCorteDerecho = previousRow
            ? parseFloat(((row['Abscisa (m)'] - previousRow['Abscisa (m)']) * ((row['Área Corte Carril Derecho (m²)'] + previousRow['Área Corte Carril Derecho (m²)']) / 2)).toFixed(2))
            : 0;
  
          return {
            ...row,
            'Volumen Corte Izquierdo (m³)': volCorteIzquierdo,
            'Volumen Corte Derecho (m³)': volCorteDerecho,
          };
        });
  
    const totalVolumenIzquierdo = updatedData.reduce((sum, row) => sum + (row['Volumen Corte Izquierdo (m³)'] || 0), 0);
    const totalVolumenDerecho = updatedData.reduce((sum, row) => sum + (row['Volumen Corte Derecho (m³)'] || 0), 0);
  
    setShowError(hasPositiveDifference);
    setTableData(updatedData);
    setTotalVolumenIzquierdo(totalVolumenIzquierdo);
    setTotalVolumenDerecho(totalVolumenDerecho);
  };

  const columns = [
    { header: 'Descripción', accessorKey: 'DESCRIPCION' },
    { header: 'Abscisa (m)', accessorKey: 'Abscisa (m)' },
    { header: 'BI Cota Negra (m)', accessorKey: 'BI Cota_Negra (m)' },
    { header: 'Eje Cota Negra (m)', accessorKey: 'Eje Cota_Negra (m)' },
    { header: 'BD Cota Negra (m)', accessorKey: 'BD Cota_Negra (m)' },
    { header: 'BI Cota Subrasante (m)', accessorKey: 'BI Cota_Subrasante (m)' },
    { header: 'Eje Cota Subrasante (m)', accessorKey: 'Eje Cota_Subrasante (m)' },
    { header: 'BD Cota Subrasante (m)', accessorKey: 'BD Cota_Subrasante (m)' },
    { header: 'AC Izquierda (m)', accessorKey: 'AC Izquierda (m)' },
    { header: 'AC Derecha (m)', accessorKey: 'AC Derecha (m)' },
    { header: 'Diferencia Izquierda', accessorKey: 'Diferencia Izquierda' },
    { header: 'Diferencia Eje', accessorKey: 'Diferencia Eje' },
    { header: 'Diferencia Derecha', accessorKey: 'Diferencia Derecha' },
    ...(!showError
      ? [
          { header: 'Área Corte Carril Izquierdo (m²)', accessorKey: 'Área Corte Carril Izquierdo (m²)' },
          { header: 'Área Corte Carril Derecho (m²)', accessorKey: 'Área Corte Carril Derecho (m²)' },
          { header: 'Volumen Corte Izquierdo (m³)', accessorKey: 'Volumen Corte Izquierdo (m³)' },
          { header: 'Volumen Corte Derecho (m³)', accessorKey: 'Volumen Corte Derecho (m³)' },
        ]
      : []),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const copyTableDataToClipboard = () => {
    if (tableData.length === 0) return;
  
    const header = columns.map(col => col.header).join('\t');
    const rows = tableData.map((row: any) =>
      columns.map(col => row[col.accessorKey]).join('\t')
    );
  
    const csvContent = [header, ...rows].join('\n');
  
    navigator.clipboard.writeText(csvContent).then(() => {
      alert('Datos copiados al portapapeles. Puedes pegarlos en Excel.');
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  };

  return (
    <main className="w-2/3 py-6 mx-auto font-mono">
      
      <div className="flex justify-between items-center">
        <div>
        <h1 className="font-bold text-2xl">Proyecto</h1>
        <p className="text-gray-500">Cartera de nivelación</p>
        </div>
        <a href={'/proyectos/'+id_proyecto} className=" text-gray-600 hover:text-gray-900 rounded">Volver</a>
      </div>
        <section className="mt-6 space-y-6">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionar uno</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">

      <Select onValueChange={(value) => setDescription(value)}>
        <SelectTrigger >
          <SelectValue placeholder="Descripción" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Descripción</SelectLabel>
              {uniqueDescripciones.map((descripcion) => (
                <SelectItem key={descripcion} value={descripcion}>
                  {descripcion}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Abscisa inicial"
          value={startAbscissa}
          onChange={(e) => setStartAbscissa(e.target.value)}
          type="number"
        />
        <Input
          placeholder="Abscisa final"
          value={endAbscissa}
          onChange={(e) => setEndAbscissa(e.target.value)}
          type="number"
        />
      </div>

      <button
        onClick={filterData}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Filtrar datos
      </button>

      <button
        onClick={copyTableDataToClipboard}
        className="mb-4 bg-green-500 text-white ml-4 px-4 py-2 rounded"
      >
        Copiar datos a Excel
      </button>

      {tableData.length > 0 && (
        <div className="overflow-x-auto">
          {showError && (
            <p className="text-red-500 font-bold text-center mb-4">Hay diferencias positivas en los datos filtrados.</p>
          )}
          {!showError && (
            <div className="text-right mb-4">
              <p className="font-bold">Total Volumen Corte Izquierdo (m³): {totalVolumenIzquierdo.toFixed(2)}</p>
              <p className="font-bold">Total Volumen Corte Derecho (m³): {totalVolumenDerecho.toFixed(2)}</p>
              
          <p className="font-bold">Volumen Corte Total (m³): {(totalVolumenIzquierdo+totalVolumenDerecho).toFixed(2)}</p>
              <Button onClick={() => {updateProjectTotal(id_proyecto, totalVolumenIzquierdo, totalVolumenDerecho); alert("Totales actualizados")}}
              className='mt-2'  >Actualizar Totales</Button>
            </div>
          )}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        color:
                          (cell.column.id === 'Diferencia Izquierda' ||
                            cell.column.id === 'Diferencia Eje' ||
                            cell.column.id === 'Diferencia Derecha') &&
                          Number(cell.getValue()) > 0
                            ? 'red'
                            : 'inherit',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
    </main>
  );
}