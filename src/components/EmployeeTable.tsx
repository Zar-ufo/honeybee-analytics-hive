import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Employee } from "@/types/employee";
import { UseMutationResult } from "@tanstack/react-query";

interface EmployeeTableProps {
  employees: Employee[];
  onToggleActive: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  updateEmployeeMutation: UseMutationResult<void, Error, { id: string; data: Partial<Employee> }, unknown>;
  deleteEmployeeMutation: UseMutationResult<void, Error, string, unknown>;
}

export function EmployeeTable({ 
  employees, 
  onToggleActive, 
  onDeleteEmployee, 
  updateEmployeeMutation, 
  deleteEmployeeMutation 
}: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name (Login)</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No employees found. Add your first employee to get started.
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {employee.role || 'employee'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  className={employee.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  onClick={() => onToggleActive(employee)}
                  style={{ cursor: 'pointer' }}
                >
                  {employee.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onToggleActive(employee)}
                    disabled={updateEmployeeMutation.isPending}
                  >
                    {employee.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDeleteEmployee(employee.id)}
                    disabled={deleteEmployeeMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}