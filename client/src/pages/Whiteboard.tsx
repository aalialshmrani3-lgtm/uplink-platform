import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { 
  Pencil, Eraser, Square, Circle, Type, Image as ImageIcon,
  Undo, Redo, Download, Share2, Users, Trash2, ChevronLeft,
  MousePointer, Move, ZoomIn, ZoomOut, Palette, Layers,
  StickyNote, ArrowRight, Minus, Plus, Save, Grid3X3,
  Lightbulb, Sparkles, Link2, MessageSquare, Lock, Eye
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

// أنواع العناصر
type ElementType = 'pencil' | 'rectangle' | 'circle' | 'text' | 'sticky' | 'arrow' | 'line';
type Tool = 'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'sticky' | 'arrow' | 'line' | 'pan';

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  id: string;
  type: ElementType;
  points?: Point[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

// المستخدمين المتصلين
const connectedUsers = [
  { id: 1, name: 'أحمد', color: '#00d4aa', cursor: { x: 200, y: 150 } },
  { id: 2, name: 'سارة', color: '#8b5cf6', cursor: { x: 400, y: 300 } },
  { id: 3, name: 'محمد', color: '#f59e0b', cursor: { x: 600, y: 200 } },
];

// الألوان المتاحة
const colors = [
  '#ffffff', '#000000', '#00d4aa', '#0ea5e9', '#8b5cf6', 
  '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#6366f1'
];

export default function Whiteboard() {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#00d4aa');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<DrawElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // رسم الشبكة
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [showGrid]);

  // رسم العناصر
  const drawElements = useCallback((ctx: CanvasRenderingContext2D) => {
    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (element.type) {
        case 'pencil':
          if (element.points && element.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            element.points.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          break;
        case 'rectangle':
          if (element.x !== undefined && element.y !== undefined && element.width && element.height) {
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
          break;
        case 'circle':
          if (element.x !== undefined && element.y !== undefined && element.width) {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.width / 2, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        case 'line':
          if (element.points && element.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            ctx.lineTo(element.points[1].x, element.points[1].y);
            ctx.stroke();
          }
          break;
        case 'arrow':
          if (element.points && element.points.length >= 2) {
            const start = element.points[0];
            const end = element.points[1];
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const headLength = 15;
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - headLength * Math.cos(angle - Math.PI / 6),
              end.y - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - headLength * Math.cos(angle + Math.PI / 6),
              end.y - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
          break;
        case 'sticky':
          if (element.x !== undefined && element.y !== undefined) {
            ctx.fillStyle = element.color + '40';
            ctx.fillRect(element.x, element.y, 150, 150);
            ctx.strokeStyle = element.color;
            ctx.strokeRect(element.x, element.y, 150, 150);
            if (element.text) {
              ctx.fillStyle = '#ffffff';
              ctx.font = '14px Cairo';
              ctx.fillText(element.text, element.x + 10, element.y + 30);
            }
          }
          break;
        case 'text':
          if (element.x !== undefined && element.y !== undefined && element.text) {
            ctx.font = `${element.strokeWidth * 6}px Cairo`;
            ctx.fillText(element.text, element.x, element.y);
          }
          break;
      }
    });
  }, [elements]);

  // إعادة رسم الكانفاس
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح الكانفاس
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // رسم الشبكة
    drawGrid(ctx, canvas);
    
    // رسم العناصر
    drawElements(ctx);
    
    // رسم العنصر الحالي
    if (currentElement) {
      ctx.strokeStyle = currentElement.color;
      ctx.fillStyle = currentElement.color;
      ctx.lineWidth = currentElement.strokeWidth;
      
      if (currentElement.type === 'pencil' && currentElement.points) {
        ctx.beginPath();
        ctx.moveTo(currentElement.points[0].x, currentElement.points[0].y);
        currentElement.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }
  }, [elements, currentElement, drawGrid, drawElements]);

  // بدء الرسم
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentElement({
        id: Date.now().toString(),
        type: 'pencil',
        points: [{ x, y }],
        color: tool === 'eraser' ? '#0a0f1a' : color,
        strokeWidth: tool === 'eraser' ? strokeWidth * 3 : strokeWidth,
      });
    } else if (tool === 'rectangle' || tool === 'circle') {
      setCurrentElement({
        id: Date.now().toString(),
        type: tool,
        x,
        y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
      });
    } else if (tool === 'line' || tool === 'arrow') {
      setCurrentElement({
        id: Date.now().toString(),
        type: tool,
        points: [{ x, y }, { x, y }],
        color,
        strokeWidth,
      });
    } else if (tool === 'sticky') {
      const newElement: DrawElement = {
        id: Date.now().toString(),
        type: 'sticky',
        x,
        y,
        text: 'ملاحظة جديدة',
        color,
        strokeWidth,
      };
      setElements([...elements, newElement]);
      saveToHistory([...elements, newElement]);
    } else if (tool === 'text') {
      const text = prompt('أدخل النص:');
      if (text) {
        const newElement: DrawElement = {
          id: Date.now().toString(),
          type: 'text',
          x,
          y,
          text,
          color,
          strokeWidth,
        };
        setElements([...elements, newElement]);
        saveToHistory([...elements, newElement]);
      }
    }
  };

  // الرسم
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentElement.type === 'pencil') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
      });
    } else if (currentElement.type === 'rectangle' || currentElement.type === 'circle') {
      setCurrentElement({
        ...currentElement,
        width: x - (currentElement.x || 0),
        height: y - (currentElement.y || 0),
      });
    } else if (currentElement.type === 'line' || currentElement.type === 'arrow') {
      setCurrentElement({
        ...currentElement,
        points: [currentElement.points![0], { x, y }],
      });
    }
  };

  // إنهاء الرسم
  const stopDrawing = () => {
    if (isDrawing && currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      saveToHistory(newElements);
    }
    setIsDrawing(false);
    setCurrentElement(null);
  };

  // حفظ في التاريخ
  const saveToHistory = (newElements: DrawElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // تراجع
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  // إعادة
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // مسح الكل
  const clearCanvas = () => {
    setElements([]);
    saveToHistory([]);
  };

  // تحميل الصورة
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'تحديد' },
    { id: 'pencil', icon: Pencil, label: 'قلم' },
    { id: 'eraser', icon: Eraser, label: 'ممحاة' },
    { id: 'line', icon: Minus, label: 'خط' },
    { id: 'arrow', icon: ArrowRight, label: 'سهم' },
    { id: 'rectangle', icon: Square, label: 'مستطيل' },
    { id: 'circle', icon: Circle, label: 'دائرة' },
    { id: 'text', icon: Type, label: 'نص' },
    { id: 'sticky', icon: StickyNote, label: 'ملاحظة' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d1320]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">لوحة الأفكار التفاعلية</h1>
                <p className="text-xs text-white/50">تعاون في الوقت الحقيقي</p>
              </div>
            </div>
          </div>
          
          {/* Connected Users */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {connectedUsers.map((u) => (
                  <Avatar key={u.id} className="w-8 h-8 border-2 border-[#0d1320]">
                    <AvatarFallback style={{ backgroundColor: u.color }} className="text-white text-xs">
                      {u.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                <Users className="w-3 h-3 ml-1" />
                {connectedUsers.length} متصل
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <Share2 className="w-4 h-4 ml-1" />
                مشاركة
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <Save className="w-4 h-4 ml-1" />
                حفظ
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Tools Sidebar */}
        <div className="w-16 border-l border-white/10 bg-[#0d1320]/50 flex flex-col items-center py-4 gap-2">
          {tools.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              size="icon"
              className={`rounded-xl transition-all ${
                tool === t.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400' 
                  : 'text-white/50 hover:text-white'
              }`}
              onClick={() => setTool(t.id as Tool)}
              title={t.label}
            >
              <t.icon className="w-5 h-5" />
            </Button>
          ))}
          
          <div className="w-8 h-px bg-white/10 my-2" />
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-white/50 hover:text-white"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-white/50 hover:text-white"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-px bg-white/10 my-2" />
          
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-xl ${showGrid ? 'text-cyan-400' : 'text-white/50'}`}
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-white/50 hover:text-white"
            onClick={downloadCanvas}
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-red-400 hover:text-red-300"
            onClick={clearCanvas}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0d1320]/80 backdrop-blur-sm rounded-full px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full text-white/70"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-white/70 w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full text-white/70"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Connected Users Cursors */}
          {connectedUsers.map((u) => (
            <div
              key={u.id}
              className="absolute pointer-events-none transition-all duration-100"
              style={{ left: u.cursor.x, top: u.cursor.y }}
            >
              <MousePointer className="w-4 h-4" style={{ color: u.color }} />
              <span 
                className="text-xs px-2 py-0.5 rounded-full mr-1 mt-1 inline-block"
                style={{ backgroundColor: u.color }}
              >
                {u.name}
              </span>
            </div>
          ))}
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-r border-white/10 bg-[#0d1320]/50 p-4 space-y-6">
          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              الألوان
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0d1320]' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          {/* Stroke Width */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-3">سمك الخط</h3>
            <div className="flex items-center gap-3">
              <Slider
                value={[strokeWidth]}
                onValueChange={(v) => setStrokeWidth(v[0])}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-white/50 w-8">{strokeWidth}px</span>
            </div>
          </div>
          
          {/* Layers */}
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              العناصر ({elements.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {elements.slice(-5).reverse().map((el, i) => (
                <div key={el.id} className="flex items-center gap-2 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: el.color }} />
                  <span>{el.type}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-white/70 border-white/10">
              <Sparkles className="w-4 h-4 ml-2" />
              اقتراحات AI
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-white/70 border-white/10">
              <Link2 className="w-4 h-4 ml-2" />
              ربط بمشروع
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-white/70 border-white/10">
              <MessageSquare className="w-4 h-4 ml-2" />
              إضافة تعليق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
