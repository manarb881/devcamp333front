
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface QROptions {
  foreground: string;
  background: string;
  size: number;
  includeMargin: boolean;
  level: "L" | "M" | "Q" | "H";
}

export function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [orderId, setOrderId] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [options, setOptions] = useState<QROptions>({
    foreground: "#000000",
    background: "#ffffff",
    size: 200,
    includeMargin: true,
    level: "M",
  });
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const generateQRCode = () => {
    if (!text && !orderId) {
      toast({
        title: "Input required",
        description: "Please enter text or order ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, you'd use a library like qrcode.react or call a backend API
    // Here we'll simulate the generation with a placeholder image
    setTimeout(() => {
      // This is a placeholder for actual QR generation
      // You would replace this with real QR code generation using a library
      const fgColor = options.foreground.replace('#', '');
      const bgColor = options.background.replace('#', '');
      const content = orderId || text;
      
      // Using placeholder.com to simulate QR image with colors
      const qrImageUrl = `https://via.placeholder.com/${options.size}/${fgColor}/${bgColor}?text=${encodeURIComponent(`QR: ${content.substring(0, 10)}...`)}`;
      setQrImage(qrImageUrl);
      
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been created successfully",
      });
      setIsLoading(false);
    }, 1000);
  };

  const downloadQR = () => {
    if (!qrImage) return;
    
    // In a real app with actual QR code generation, you'd handle saving the image
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Create QR codes for your orders or any text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="order">Order ID</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <div className="space-y-2">
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  placeholder="Enter text for QR code"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="order">
              <div className="space-y-2">
                <Label htmlFor="order-id">Order ID</Label>
                <Input
                  id="order-id"
                  placeholder="Enter order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fg-color">Foreground Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="fg-color"
                    type="color"
                    value={options.foreground}
                    onChange={(e) => setOptions({...options, foreground: e.target.value})}
                    className="w-12 p-1 h-9"
                  />
                  <Input 
                    value={options.foreground} 
                    onChange={(e) => setOptions({...options, foreground: e.target.value})}
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={options.background}
                    onChange={(e) => setOptions({...options, background: e.target.value})}
                    className="w-12 p-1 h-9"
                  />
                  <Input 
                    value={options.background} 
                    onChange={(e) => setOptions({...options, background: e.target.value})}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Size: {options.size}px</Label>
              <Input
                id="size"
                type="range"
                min="100"
                max="400"
                step="10"
                value={options.size}
                onChange={(e) => setOptions({...options, size: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <div 
              ref={qrRef} 
              className="border rounded-md overflow-hidden transition-all duration-300"
              style={{ width: `${options.size}px`, height: `${options.size}px` }}
            >
              {qrImage ? (
                <img 
                  src={qrImage} 
                  alt="QR Code" 
                  className="w-full h-full" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-center">
                  QR code will appear here
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={generateQRCode} className="w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate QR Code"}
          </Button>
          {qrImage && (
            <Button onClick={downloadQR} variant="outline" className="w-full">
              Download QR Code
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
