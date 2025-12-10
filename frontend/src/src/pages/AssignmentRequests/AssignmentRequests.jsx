import RequestsTable from "../../components/RequestsTable";
import { UserPlus } from "lucide-react";

export default function AssignmentRequests() {
    return (
        <RequestsTable
            title="Solicitudes Pendientes de Asignación"
            subtitle="Gestiona y asigna las solicitudes entrantes a los responsables correspondientes"
            filterStatusId={3} // ID 3: Pendiente asignar
            targetRoute="/asignacion/gestion"
            breadcrumbs={[{ label: "Asignación de Solicitudes", path: "/asignacion" }]}
            actionIcon={<UserPlus size={32} className="text-teal-600" />}
        />
    );
}
