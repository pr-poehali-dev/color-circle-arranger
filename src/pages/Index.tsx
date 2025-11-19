import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

interface Composition {
  id: string;
  circles: Circle[];
  timestamp: number;
}

const COLOR_PALETTES = [
  ['#6E59A5', '#E5DEFF', '#0EA5E9', '#9b87f5', '#D6BCFA'],
  ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#FFDEE2'],
  ['#1EAEDB', '#33C3F0', '#C8C8C9', '#F6F6F7', '#9F9EA1'],
];

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [circleCount, setCircleCount] = useState([30]);
  const [circleSize, setCircleSize] = useState([20]);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number>();

  const generateComposition = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const palette = COLOR_PALETTES[paletteIndex];
    const newCircles: Circle[] = [];

    for (let i = 0; i < circleCount[0]; i++) {
      const radius = circleSize[0] + Math.random() * circleSize[0];
      const x = radius + Math.random() * (width - radius * 2);
      const y = radius + Math.random() * (height - radius * 2);
      const color = palette[Math.floor(Math.random() * palette.length)];
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;

      newCircles.push({ x, y, radius, color, vx, vy });
    }

    setCircles(newCircles);
  };

  const drawCircles = (circlesToDraw: Circle[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circlesToDraw.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const animate = () => {
    if (!isAnimating) return;

    setCircles((prevCircles) => {
      const canvas = canvasRef.current;
      if (!canvas) return prevCircles;

      const updatedCircles = prevCircles.map((circle) => {
        let newX = circle.x + circle.vx;
        let newY = circle.y + circle.vy;
        let newVx = circle.vx;
        let newVy = circle.vy;

        if (newX - circle.radius < 0 || newX + circle.radius > canvas.width) {
          newVx = -newVx;
          newX = Math.max(circle.radius, Math.min(canvas.width - circle.radius, newX));
        }

        if (newY - circle.radius < 0 || newY + circle.radius > canvas.height) {
          newVy = -newVy;
          newY = Math.max(circle.radius, Math.min(canvas.height - circle.radius, newY));
        }

        return { ...circle, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      drawCircles(updatedCircles);
      return updatedCircles;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isAnimating) {
      animate();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating]);

  useEffect(() => {
    drawCircles(circles);
  }, [circles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    generateComposition();
  }, []);

  const saveComposition = () => {
    const newComposition: Composition = {
      id: Date.now().toString(),
      circles: [...circles],
      timestamp: Date.now(),
    };
    setCompositions([newComposition, ...compositions]);
  };

  const loadComposition = (composition: Composition) => {
    setCircles(composition.circles);
    setIsAnimating(false);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `composition-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-primary">AI Композиции</h1>
          <p className="text-muted-foreground mt-2">Генеративное искусство с цветными кружочками</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <Card className="p-8 bg-card border-border/40 shadow-lg">
              <canvas
                ref={canvasRef}
                className="w-full rounded-lg bg-white"
                style={{ height: '600px' }}
              />
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={generateComposition}
                  className="flex-1"
                  size="lg"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Новая композиция
                </Button>
                <Button
                  onClick={() => setIsAnimating(!isAnimating)}
                  variant={isAnimating ? 'destructive' : 'secondary'}
                  size="lg"
                >
                  <Icon name={isAnimating ? 'Pause' : 'Play'} size={20} />
                </Button>
                <Button
                  onClick={saveComposition}
                  variant="secondary"
                  size="lg"
                >
                  <Icon name="Save" size={20} />
                </Button>
                <Button
                  onClick={exportCanvas}
                  variant="secondary"
                  size="lg"
                >
                  <Icon name="Download" size={20} />
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/40">
              <h2 className="text-2xl font-semibold mb-6">Галерея композиций</h2>
              {compositions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="ImageOff" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Сохранённых композиций пока нет</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {compositions.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => loadComposition(comp)}
                      className="aspect-square bg-white rounded-lg border-2 border-border/40 hover:border-primary transition-all hover:scale-105 overflow-hidden group"
                    >
                      <canvas
                        ref={(canvas) => {
                          if (canvas) {
                            canvas.width = 300;
                            canvas.height = 300;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.clearRect(0, 0, 300, 300);
                              comp.circles.forEach((circle) => {
                                const scale = 300 / 600;
                                ctx.beginPath();
                                ctx.arc(
                                  circle.x * scale,
                                  circle.y * scale,
                                  circle.radius * scale,
                                  0,
                                  Math.PI * 2
                                );
                                ctx.fillStyle = circle.color;
                                ctx.fill();
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                              });
                            }
                          }
                        }}
                        className="w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/40 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Параметры генерации</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Количество: {circleCount[0]}
                  </Label>
                  <Slider
                    value={circleCount}
                    onValueChange={setCircleCount}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Размер: {circleSize[0]}px
                  </Label>
                  <Slider
                    value={circleSize}
                    onValueChange={setCircleSize}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Цветовая палитра</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {COLOR_PALETTES.map((palette, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPaletteIndex(idx)}
                        className={`h-20 rounded-lg border-2 transition-all hover:scale-105 ${
                          paletteIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${palette.join(', ')})`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Info" size={16} />
                    <span>Меняйте параметры и жмите "Новая композиция"</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
