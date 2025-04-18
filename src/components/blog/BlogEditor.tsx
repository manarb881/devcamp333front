
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// A simple rich text editor
// In a real app, you'd want to use a library like TipTap, Draft.js, or Quill
export function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const { toast } = useToast();

  const applyFormat = (format: string) => {
    const textArea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = "";
    let cursorAdjustment = 0;
    
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorAdjustment = 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorAdjustment = 1;
        break;
      case "heading":
        formattedText = `## ${selectedText}`;
        cursorAdjustment = 3;
        break;
      case "quote":
        formattedText = `> ${selectedText}`;
        cursorAdjustment = 2;
        break;
      case "code":
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorAdjustment = 4;
        break;
      case "list":
        formattedText = `- ${selectedText}`;
        cursorAdjustment = 2;
        break;
      default:
        formattedText = selectedText;
    }
    
    setContent(
      content.substring(0, start) +
      formattedText +
      content.substring(end)
    );

    // Reset selection
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(
        start + cursorAdjustment,
        start + formattedText.length - cursorAdjustment
      );
    }, 0);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your blog post",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      toast({
        title: "Blog post saved!",
        description: "Your blog post has been successfully saved",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter a captivating title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("bold")}
              className="px-2 py-1 h-8 font-bold"
              type="button"
            >
              B
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("italic")}
              className="px-2 py-1 h-8 italic"
              type="button"
            >
              I
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("heading")}
              className="px-2 py-1 h-8"
              type="button"
            >
              H
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("quote")}
              className="px-2 py-1 h-8"
              type="button"
            >
              "
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("code")}
              className="px-2 py-1 h-8 font-mono"
              type="button"
            >
              {"</>"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormat("list")}
              className="px-2 py-1 h-8"
              type="button"
            >
              •
            </Button>
          </div>
        </div>
        
        <Textarea
          id="content"
          placeholder="Write your blog post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] font-mono"
        />
      </div>
      
      <Card className="border border-dashed">
        <CardContent className="p-4 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="bg-background rounded-md p-4 break-words">
            <h1 className="text-xl font-bold mb-4">{title || "Your Title"}</h1>
            <div className="whitespace-pre-wrap">
              {content || "Your content will appear here..."}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </div>
  );
}
