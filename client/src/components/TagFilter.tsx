import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Tag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagFilter({ availableTags, selectedTags, onTagsChange }: TagFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Filter Button */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب العلامات
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-cyan-500/20 text-cyan-300">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-slate-900 border-slate-800"
          align="start"
        >
          <div className="p-2 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">اختر العلامات</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-6 text-xs text-slate-400 hover:text-white"
                >
                  مسح الكل
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
                className="text-white hover:bg-slate-800"
              >
                <Tag className="w-3 h-3 mr-2 text-cyan-400" />
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-400">الفلاتر النشطة:</span>
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 text-xs text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3 mr-1" />
            مسح الكل
          </Button>
        </div>
      )}
    </div>
  );
}
