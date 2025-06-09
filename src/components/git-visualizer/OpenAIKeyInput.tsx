
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Key, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OpenAIKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

export const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onApiKeySet, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to enable AI analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'.",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage for this session
    localStorage.setItem('openai_api_key', apiKey);
    onApiKeySet(apiKey);
    
    toast({
      title: "API Key Set",
      description: "OpenAI integration enabled for advanced analysis.",
    });
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    onApiKeySet('');
    
    toast({
      title: "API Key Cleared",
      description: "OpenAI integration disabled.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          OpenAI Integration
        </CardTitle>
        <CardDescription>
          Add your OpenAI API key to enable advanced AI-powered repository analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="openai-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSubmit} disabled={!apiKey.trim()}>
              <Key className="w-4 h-4 mr-2" />
              Set Key
            </Button>
            {currentApiKey && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Your API key is stored locally in your browser</p>
          <p>• Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 hover:underline">OpenAI Platform</a></p>
          <p>• AI analysis provides architecture insights, recommendations, and quality scores</p>
        </div>
        
        {currentApiKey && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ OpenAI integration is active and ready for analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
