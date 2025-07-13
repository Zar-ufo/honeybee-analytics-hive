import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { EmployeeTable } from "@/components/EmployeeTable";

export function CompanyEmployeeManager() {
  const { employee: currentEmployee } = useAuth();
  const {
    employees,
    isLoading,
    addEmployeeMutation,
    updateEmployeeMutation,
    deleteEmployeeMutation,
    handleToggleActive,
    handleDeleteEmployee
  } = useEmployeeManagement();

  // Only allow admin/manager roles to manage employees
  const canManageEmployees = currentEmployee?.role === 'admin' || currentEmployee?.role === 'manager';

  if (!canManageEmployees) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">Access restricted to administrators and managers</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Access Denied</p>
              <p className="text-muted-foreground">You don't have permission to manage employees.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">
            Manage employees for {currentEmployee?.companies?.name}
          </p>
        </div>
        <AddEmployeeDialog addEmployeeMutation={addEmployeeMutation} />
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Employees</CardTitle>
          <CardDescription>
            Manage employee accounts and permissions. Employees use their name and password to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={employees}
            onToggleActive={handleToggleActive}
            onDeleteEmployee={handleDeleteEmployee}
            updateEmployeeMutation={updateEmployeeMutation}
            deleteEmployeeMutation={deleteEmployeeMutation}
          />
        </CardContent>
      </Card>
    </div>
  );
}