import RequestsTable from "../../components/RequestsTable";
import { FileText } from "lucide-react";

export default function RequestSelector() {
  return (
    <RequestsTable
      title="Solicitudes Pendientes de Construcción"
      subtitle="Selecciona una solicitud para abrir el constructor de documentos"
      filterStatusId={4}
      targetRoute="/constructor"
      breadcrumbs={[{ label: "Consulta de Solicitudes", path: "/consulta" }]}
      actionIcon={<FileText size={32} className="text-blue-600" />}
    />
  );
}
