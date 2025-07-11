
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface Employee {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  company_id: string;
  companies: {
    name: string;
  };
}

export function CompanyEmployeeManager() {
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "employee",
    company_id: ""
  });

  const queryClient = useQueryClient();

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Company[];
    }
  });

  // Fetch employees
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          companies (
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  const addCompanyMutation = useMutation({
    mutationFn: async (companyData: typeof newCompany) => {
      const { data, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Company added successfully!");
      setIsCompanyDialogOpen(false);
      setNewCompany({ name: "", email: "", phone: "", address: "" });
    },
    onError: (error) => {
      console.error('Error adding company:', error);
      toast.error("Failed to add company. Please try again.");
    }
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData: typeof newEmployee) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employeeData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee added successfully!");
      setIsEmployeeDialogOpen(false);
      setNewEmployee({ name: "", email: "", role: "employee", company_id: "" });
    },
    onError: (error) => {
      console.error('Error adding employee:', error);
      toast.error("Failed to add employee. Please try again.");
    }
  });

  const handleAddCompany = () => {
    if (newCompany.name) {
      addCompanyMutation.mutate(newCompany);
    } else {
      toast.error("Please fill in the company name.");
    }
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.company_id) {
      addEmployeeMutation.mutate(newEmployee);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Company & Employee Management</h2>
        <p className="text-muted-foreground">Manage companies and their employees</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Building2 className="h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Enter the details for the new company.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyName" className="text-right">Name *</Label>
                <Input
                  id="companyName"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyEmail" className="text-right">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyPhone" className="text-right">Phone</Label>
                <Input
                  id="companyPhone"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyAddress" className="text-right">Address</Label>
                <Input
                  id="companyAddress"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCompany} disabled={addCompanyMutation.isPending}>
                {addCompanyMutation.isPending ? "Adding..." : "Add Company"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details for the new employee.
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeCompany" className="text-right">Company *</Label>
                <Select value={newEmployee.company_id} onValueChange={(value) => setNewEmployee({ ...newEmployee, company_id: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
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

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>All registered companies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No companies found. Add your first company to get started.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.email || '-'}</TableCell>
                    <TableCell>{company.phone || '-'}</TableCell>
                    <TableCell>{company.address || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>All registered employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>{employee.companies.name}</TableCell>
                    <TableCell>
                      <Badge className={employee.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </Badge>
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
