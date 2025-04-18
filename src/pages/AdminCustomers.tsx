import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const AdminCustomers = () => {
  const navigate = useNavigate();
  const { customers, isAdmin } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not an admin
  if (!isAdmin) {
    setTimeout(() => navigate("/"), 0);
    return null;
  }
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header with total customer count */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold ">
          Customers
        </h1>
        <p className="text-sm  text-purple-700">
          Total customers: {customers.length}
        </p>
      </div>
      
      {/* Search Input */}
      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search"
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={1} className="text-center py-8 text-muted-foreground">
                  {searchTerm 
                    ? "No customers matching your search." 
                    : "No customers found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary h-9 w-9 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
