
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useData, Product } from "@/contexts/DataContext";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, isAdmin } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: ""
  });
  
  // Redirect if not an admin
  if (!isAdmin) {
    setTimeout(() => navigate("/products"), 0);
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl || !formData.category) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
      toast.success(`Product "${formData.name}" updated successfully`);
    } else {
      addProduct(formData);
      toast.success(`Product "${formData.name}" added successfully`);
    }
    
    resetForm();
  };
  
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    });
    setShowForm(true);
  };
  
  const handleDeleteClick = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success(`"${name}" has been deleted`);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: ""
    });
    setEditingProduct(null);
    setShowForm(false);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container-custom flex-grow">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
          
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            {showForm ? 'Cancel' : <><Plus size={18} /> Add New Product</>}
          </Button>
        </div>
        
        <h1 className="page-heading">Manage Products</h1>
        <p className="text-muted-foreground mb-6">
          Add, edit, or delete products from the store
        </p>
        
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct 
                  ? `Making changes to "${editingProduct.name}"` 
                  : 'Fill in the details to add a new product'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Product name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Category"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Product description"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products available. Add a new product to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;