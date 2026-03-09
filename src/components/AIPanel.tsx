
'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AIPanelProps {
  aiResponse: string;
  isLoading: boolean;
  onGetTrend: () => void;
  onGeneratePlan: () => void;
  onExplain: () => void;
  model: 'gpt' | 'deepseek';
  onModelChange: (model: 'gpt' | 'deepseek') => void;
}

export function AIPanel({ aiResponse, isLoading, onGetTrend, onGeneratePlan, onExplain, model, onModelChange }: AIPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Panel</h2>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt">GPT-4</SelectItem>
            <SelectItem value="deepseek">Deepseek</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow mb-4">
        <Textarea value={aiResponse} readOnly className="w-full h-full resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onGetTrend} disabled={isLoading}>Get Trend</Button>
        <Button onClick={onGeneratePlan} disabled={isLoading}>Generate Plan</Button>
        <Button onClick={onExplain} disabled={isLoading} className="col-span-2">Explain</Button>
      </div>
    </div>
  );
}
