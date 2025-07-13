import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Employee, NewEmployee } from "@/types/employee";

export function useEmployeeManagement() {
  const { employee: currentEmployee } = useAuth();
  const queryClient = useQueryClient();

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
    mutationFn: async (employeeData: NewEmployee) => {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          name: employeeData.name,
          email: employeeData.email || null,
          password: employeeData.password,
          role: employeeData.role,
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

  return {
    employees,
    isLoading,
    addEmployeeMutation,
    updateEmployeeMutation,
    deleteEmployeeMutation,
    handleToggleActive,
    handleDeleteEmployee
  };
}