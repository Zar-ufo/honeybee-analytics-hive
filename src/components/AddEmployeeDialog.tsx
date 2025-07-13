import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { NewEmployee } from "@/types/employee";
import { UseMutationResult } from "@tanstack/react-query";

interface AddEmployeeDialogProps {
  addEmployeeMutation: UseMutationResult<any, Error, NewEmployee, unknown>;
}

export function AddEmployeeDialog({ addEmployeeMutation }: AddEmployeeDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.password) {
      addEmployeeMutation.mutate(newEmployee, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setNewEmployee({ name: "", email: "", password: "", role: "employee" });
        }
      });
    } else {
      toast.error("Please fill in the name and password fields.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            Create a new employee account for your company. The employee will use the name and password to log in.
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
              placeholder="Employee full name (used for login)"
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
  );
}