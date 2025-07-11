import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  company_id: string;
  password: string;
  companies: {
    name: string;
  };
}

export function CompanyEmployeeManager() {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const { employee: currentEmployee } = useAuth();
  const queryClient = useQueryClient();

  // Only allow admin/manager roles to manage employees
  const canManageEmployees = currentEmployee?.role === 'admin' || currentEmployee?.role === 'manager';

  // Fetch employees for the current company
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['company-employees', currentEmployee?.company_id],
    queryFn: async () => {
      if (!currentEmployee?.company_id) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('company_id', currentEmployee.company_id)
        .order('name');
      
      if (error) throw error;
      return data as Employee[];
    },
    enabled: !!currentEmployee?.company_id
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData: typeof newEmployee) => {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          ...employeeData,
          company_id: currentEmployee?.company_id,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
      toast.success("Employee added successfully!");
      setIsEmployeeDialogOpen(false);
      setNewEmployee({ name: "", email: "", password: "", role: "employee" });
    },
    onError: (error) => {
      console.error('Error adding employee:', error);
      toast.error("Failed to add employee. Please try again.");
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const { error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
      toast.success("Employee updated successfully!");
      setEditingEmployee(null);
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
      toast.error("Failed to update employee. Please try again.");
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
      toast.success("Employee removed successfully!");
    },
    onError: (error) => {
      console.error('Error deleting employee:', error);
      toast.error("Failed to remove employee. Please try again.");
    }
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.password) {
      addEmployeeMutation.mutate(newEmployee);
    } else {
      toast.error("Please fill in the name and password fields.");
    }
  };

  const handleToggleActive = (employee: Employee) => {
    updateEmployeeMutation.mutate({
      id: employee.id,
      data: { is_active: !employee.is_active }
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      deleteEmployeeMutation.mutate(employeeId);
    }
  };

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
        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account for your company.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeName" className="text-right">Name *</Label>
                <Input
                  id="employeeName"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Employee full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeEmail" className="text-right">Email</Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeePassword" className="text-right">Password *</Label>
                <Input
                  id="employeePassword"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  className="col-span-3"
                  placeholder="Login password"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeRole" className="text-right">Role</Label>
                <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEmployee} disabled={addEmployeeMutation.isPending}>
                {addEmployeeMutation.isPending ? "Adding..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Employees</CardTitle>
          <CardDescription>Manage employee accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
                        onClick={() => handleToggleActive(employee)}
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
                          onClick={() => handleToggleActive(employee)}
                          disabled={updateEmployeeMutation.isPending}
                        >
                          {employee.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteEmployee(employee.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}